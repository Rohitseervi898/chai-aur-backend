import mongoose from "mongoose";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleVideoLike = asyncHandler(async(req,res)=>{
    const {videoId} = req.params

    if(!videoId.trim()){
        throw new ApiError(401,"videoid is empty")
    }

    const like = await Like.create({
        video:videoId,
        likedBy:req.user._id,
        comment:null,
        tweet:null
    })

    return res
    .status(200)
    .json(new ApiResponse(200,like,"Like added successfully"))
})

const toggleCommentLike = asyncHandler(async(req,res)=>{
    const {commentId} = req.params

    if(!commentId.trim()){
        throw new ApiError(401,"commentid is empty")
    }

    const like = await Like.create({
        comment:commentId,
        likedBy:req.user._id,
        video:null,
        tweet:null
    })

    return res
    .status(200)
    .json(new ApiResponse(200,like,"Like added successfully"))
})

const toggleTweetLike = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params

    if(!tweetId.trim()){
        throw new ApiError(401,"tweetid is empty")
    }

    const like = await Like.create({
        tweet:tweetId,
        likedBy:req.user._id,
        video:null,
        comment:null
    })

    return res
    .status(200)
    .json(new ApiResponse(200,like,"Like added successfully"))
})

const getLikedVideos = asyncHandler(async(req,res)=>{
    const videos = await Like.aggregate([
        {
            $match:{
                likedBy:new mongoose.Types.ObjectId(req.user._id),
                comment:null,
                tweet:null
            },
            
        }
    ])

    return res.status(200).json(new ApiResponse(200,videos,"success"))
})

export {
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getLikedVideos
}