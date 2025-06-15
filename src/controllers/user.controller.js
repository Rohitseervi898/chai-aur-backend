import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

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

export {registerUser};