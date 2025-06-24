import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleVideoLike = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const userId = req.user._id

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video ID")
    }

    const exitingLike = await Like.findOne({video:videoId,likedBy:userId})

    if(exitingLike){
        await Like.findByIdAndDelete({video:videoId,likedBy:userId})

        return res
        .status(200)
        .json(new ApiResponse(200,null,"video unliked"))
    }
    else{
        const like = await Like.create({
            video:videoId,
            likedBy:userId
        })

        return res
        .status(200)
        .json(new ApiResponse(200,like,"Like added successfully"))
    }
})

const toggleCommentLike = asyncHandler(async(req,res)=>{
    const {commentId} = req.params
    const userId = req.user._id

    if(!isValidObjectId(commentId)){
        throw new ApiError(401,"invalid comment id")
    }

    const exitingLike = await Like.findOne({comment:commentId,likedBy:userId})

    if(exitingLike){
        await Like.findByIdAndDelete({comment:commentId,likedBy:userId})

        return res
        .status(200)
        .json(new ApiResponse(200,null,"comment unliked"))
    }
    else{
        const like = await Like.create({
            comment:commentId,
            likedBy:userId,
        })

        return res
        .status(200)
        .json(new ApiResponse(200,like,"Like added successfully"))
    }
})

const toggleTweetLike = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params
    const userId = req.user._id

    if(!tweetId.trim()){
        throw new ApiError(401,"tweetid is empty")
    }

    const exitingLike = await Like.findOne({tweet:tweetId,likedBy:userId})

    if(exitingLike){
        await Like.findByIdAndDelete({tweet:tweetId,likedBy:userId})

        return res
        .status(200)
        .json(new ApiResponse(200,null,"tweet unliked"))
    }
    else{
        const like = await Like.create({
            tweet:tweetId,
            likedBy:userId
        })

        return res
        .status(200)
        .json(new ApiResponse(200,like,"Like added successfully"))
    }
})

const getLikedVideos = asyncHandler(async(req,res)=>{
    const userId = req.user._id

    const videos = await Like.find({
        likedBy:req.user._id,
        videoId:{$ne:null},
    }).populate("videoId")

    return res.status(200).json(new ApiResponse(200,videos,"success"))
})

export {
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getLikedVideos
}