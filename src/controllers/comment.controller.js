import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import {asyncHandler} from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Comment } from "../models/comment.model.js"


const getVideoComments = asyncHandler(async (req,res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!videoId.trim()){
        throw new ApiError(401,"VideoId id empty")
    }

    const skip = (parseInt(page)-1)*parseInt(limit);

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {$skip:skip},
        {$limit:parseInt(limit)}
    ])

    // console.log(comments)

    return res
    .status(200)
    .json(new ApiResponse(200,comments,"comments fetched successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { content } = req.body
    const {videoId} = req.params
    const userid = req.user._id

    if(!content.trim()){
        throw new ApiError(401,"Content is empty")
    }

    const comment = await Comment.create({
        content:content,
        video:videoId,
        owner:userid
    })

    return res
    .status(200)
    .json(new ApiResponse(200,comment,"Comment added successfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content} = req.body
    const {commentId} = req.params

    if(!content.trim()){
        throw new ApiError(401,"content is empty")
    }

    const comment = await Comment.findByIdAndUpdate(commentId,{
        $set:{
            content:content
        }
    },{new:true})

    return res
    .status(200)
    .json(new ApiResponse(200,comment,"comment updated successfully"))

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    if(!commentId.trim()){
        throw new ApiError(401,"Comment id is Empty")
    }

    const comment = await Comment.findByIdAndDelete(commentId)

    return res
    .status(200)
    .json(new ApiResponse(200,comment,"Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}