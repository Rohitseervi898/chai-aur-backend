import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {DeleteFromCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { verifyJWT } from "../middlewares/Auth.middleware.js"
import { Subscription } from "../models/subcription.model.js"



const generateAccessandRefreshToken = async(userid)=>{
    try{
        const user=await User.findById(userid)
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    }catch{
        throw new ApiError(500,"something went wrong while generating access token")
    }
}

const registerUser = asyncHandler( async(req , res )=>{

    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { fullName, email, username, password }=req.body
    // console.log(`${fullName} , ${email} , ${username} , ${password}`)
    
    if(
        [fullName,email,username,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(404,"All fields are required")
    }

    const exitedUser = await User.findOne({
        $or:[{ email }, { username }]
    })

    // console.log(exitedUser);

    if(exitedUser){
        throw new ApiError(409,"User with email or username already exists")
    }
    // console.log(req.files)

    // console.log("Files received:", req.files);
    const avatarLocationPath = req.files?.avatar?.[0]?.path;
    const coverImageLocationPath = req.files?.coverImage?.[0]?.path;

    // console.log("Avatar path:", avatarLocationPath);
    // console.log("Cover image path:", coverImageLocationPath);

    if(!req.files?.avatar?.[0]){
        throw new ApiError(400, "Avatar1 file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocationPath);
    const coverImage = coverImageLocationPath ? await uploadOnCloudinary(coverImageLocationPath) : null;
    // console.log(avatar)
    // console.log(coverImage)
    
    if(!avatar){
        throw new ApiError(400, "Avatar2 file is required")
    }

    const user = await User.create({
        fullName,
        email,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        password,
        username:username.toLowerCase()
    })
    
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registring the user")
    }
    
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )


    // res.status(200).json({
    //     message:"ok"
    // })
})

const loginUser = asyncHandler(async(req,res)=>{
    // get data from user
    // check if empty
    // check if user or email present
    // check if password is correct
    // generate the access and refresh token 
    // 

    // console.log("hjgfyugy");
    const { email, username, password }=req.body;
    // console.log(`${username},${email}`)
     
    if(!username && !email){
        throw new ApiError(404,"username or email is required")
    }
    const user = await User.findOne({$or:[{username},{email}]});

    if(!user){
        throw new ApiError(404,"User not found");
    }

    const isPasswordvalid = await user.isPasswordCorrect(password);

    if(!isPasswordvalid){
        throw new ApiError(401,"incorrect password");
    }

    const {accessToken,refreshToken}= await generateAccessandRefreshToken(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refresh",refreshToken,options)
    .json(new ApiResponse(
        200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "User logged In Successfully"
    ))
})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $unset:{
                refreshToken:1 //this remove the field from document
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true,
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(200,{},"User Logged Out")

})

const refreshAccessToken = asyncHandler(async (req, res)=>{
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request")
    }
    
    try {
        const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user = User.findById(decodedToken?._id);
    
        if(!user){
            throw new ApiError(401,'Invalid Refresh token')
        }
    
        const {accessToken,newRefreshToken}=generateAccessandRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken:newRefreshToken},
                "Access Token Refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message||"Invalid refresh token")
    }
})

const changePassword = asyncHandler(async(req,res)=>{
    const {oldPassword , newPassword} = req.body;

    const user = await User.findById(req.user?._id)
    
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(401,"wrong password")
    }

    user.password=newPassword;
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "password changed successfully"
        )
    )
    
})

const getCurrentUser= asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"current user fetched successfully"))
})

const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullName, email}=req.body;

    if(!fullName || !email){
        throw new ApiError(400, "All fields are required")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,
                email:email,
            }
        },
        {new:true}

    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        user,
        "Account details updated successfully"
    ))
})

const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLoaclPath=req.file?.path

    console.log(req.file?.path);

    if(!avatarLoaclPath){
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLoaclPath);

    if(!avatar.url){
        throw new ApiError(500,"error while uploading on avatar")
    }

    // const oldAvatar = await User.findById(req.user?._id).select("-password")

    // console.log(oldAvatar.avatar);

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}
    ).select("-password");

    // cloudinary need public_id and we are story url in the DataBase 
    // await DeleteFromCloudinary(oldAvatar.avatar)

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        user,
        "Avatar Updated successfully"
    ))
})

const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLoaclPath=req.file?.path

    if(!coverImageLoaclPath){
        throw new ApiError(400,"coverImage file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLoaclPath);

    if(!coverImage.url){
        throw new ApiError(500,"error while uploading on coverImage")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new:true}
    ).select("-password");

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        user,
        "Cover Image Updated successfully"
    ))
})

const getUserChannelProfile = asyncHandler(async(req,res)=>{
    const {username} = req.params

    if(!username?.trim()){
        throw new ApiError(400, "useername is missing")
    }
    const channelDetail = await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                SubscribersCount:{
                    $size:"$subscribers"
                },
                channelsSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSibscribed:{
                    $cond:{
                        if:{$in:[req.user?._id, "$subscribers.subscriber"]},
                        then:true,
                        else:false,
                    }
                }
            }
        },
        {
            $project:{
                fullName:1,
                usernamw:1,
                email:1,
                SubscribersCount:1,
                channelsSubscribedToCount:1,
                isSibscribed:1,
                avatar:1,
                coverImage:1,
            }
        }
    ])

    if(!channelDetail?.lenght){
        throw new ApiError(404,"channel does not exists")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        channelDetail[0],
        "User channel fetched successfully"
    ))
})

const getWatchHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[ // try this pipeline outside the above pipeline. 
                                {
                                    $project:{
                                        fullName:1,
                                        username:1,
                                        avatar:1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                       $addFields:{
                        owner:{
                            $first:"$owner"
                        }
                       }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        user[0].watchHistory,
        "watchHistory successfully fetched"
    ))
})

export {
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changePassword, 
    getCurrentUser, 
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    
};