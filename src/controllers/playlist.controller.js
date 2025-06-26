import mongoose from "mongoose";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPlaylist = asyncHandler(async(req,res)=>{
    const {name,description}=req.body

    if(!name.trim()==="" && !description.trim()===""){
        throw new ApiError(401,"All fields are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner:req.user._id
    })

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,'playlist created successfully'))
})

const getUserPlaylist = asyncHandler(async(req,res)=>{
    const {userId} =req.params

    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(402,"Invalid userId")
    }

    const playlists = await Playlist.find({
        owner:userId
    })

    return res
    .status(200)
    .json(new ApiResponse(200,playlists,"data fetched successfully"))

})

const getPlaylistById = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params

    if(!mongoose.isValidObjectId(playlistId)){
        throw new ApiError(402,"Invalid userId")
    }

    const playlist = await Playlist.findById(playlistId)

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,'fetched successfully'))
})

const addVideoToPlaylist = asyncHandler(async(req,res)=>{
    const {playlistId, videoId} =req.params

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(402,"Invalid videoId")
    }
    if(!mongoose.isValidObjectId(playlistId)){
        throw new ApiError(402,"Invalid playlistId")
    }

    const playlist = await Playlist.updateOne(
        {_id:playlistId},
        {$push:{videos:videoId}}
    )

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"success"))
})

const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
    const {playlistId, videoId} = req.params

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(402,"Invalid videoId")
    }
    if(!mongoose.isValidObjectId(playlistId)){
        throw new ApiError(402,"Invalid playlistId")
    }

    const playlist = await Playlist.updateOne(
        {_id:playlistId},
        {$pull:{videos:videoId}}
    )

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"success"))
})

const deletePlaylist = asyncHandler(async(req,res)=>{
    const {playlistId} =req.params

    if(!mongoose.isValidObjectId(playlistId)){
        throw new ApiError(402,"Invalid playlist id")
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"success"))
})

const updatePlaylist = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params
    const {name,description} = req.body

    if(!mongoose.isValidObjectId(playlistId)){
        throw new ApiError(402,"Invalid playlist id")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name:name,
            description:description
        },{new:true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"success"))
})

export {
    createPlaylist,
    getUserPlaylist,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}