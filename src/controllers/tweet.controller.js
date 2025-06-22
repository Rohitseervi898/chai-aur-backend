import mongoose,{isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const createTweet = asyncHandler(async(req,res)=>{
    const { content } = req.body;
    const user = req.user;
    if(!content){
        throw new ApiError(401, "Content text is Empty")
    }

    // console.log(user);
    const tweet = await Tweet.create({
        content,
        owner:user._id
    })
    // console.log(tweet)
    const createdTweet = await Tweet.findById(tweet._id)

    return res
    .status(200)
    .json(new ApiResponse(200,createdTweet,"tweet created successfully"))
})

const getUserTweets = asyncHandler(async(req,res)=>{
    const { username } = req.params;

    console.log(username)

    if(!username){
        throw new ApiError(401,"Unauthorized user")
    }

    const tweets = await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"tweets",
                localField:"_id",
                foreignField:"owner",
                as:"tweets"
            }
        },
        {
            $addFields:{
                tweets:"$tweets"
            }
        },
        {
            $project:{
                username:1,
                tweets:1
            }
        }
    ])
    console.log(tweets[0].tweets[0])
    return res
    .status(200)
    .json(new ApiResponse(200,tweets,"successfull"))

})

const updateTweet = asyncHandler(async(req,res)=>{
    
})

const deleteTweet = asyncHandler(async(req,res)=>{
    
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}