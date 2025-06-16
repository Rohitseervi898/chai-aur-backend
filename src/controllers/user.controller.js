import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const generateAccessandRefreshToken = async(userid)=>{
    try{
        const user=await User.findById(userid)
        const accesstoken=user.generateAccessToken();
        const refreshtoken=user.generateRefreshToken();
        user.refreshToken=refreshtoken
        await user.save({validateBeforeSave:false})

        return {accesstoken,refreshtoken}
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


    const {username,email,password} = req.body;
     
    if(username==="" || email===""){
        throw new ApiError(404,"username or email is required")
    }
    const user = await User.findOne({$or:[{username},{email}]});

    if(!user){
        throw new ApiError(404,"User not found");
    }

    const isPasswordvalid = await user.isPasswordCorrect(password)

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
            $set:{
                refreshToken:undefined
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

export {registerUser, loginUser, logoutUser};