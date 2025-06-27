import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { DeleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import {Video} from "../models/video.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const getAllVideos = asyncHandler(async(req,res)=>{
    if (!req.user) {
      throw new ApiError(401, "User needs to be logged in");
    }

    const match = {
      ...(query ? { title: { $regex: query, $options: "i" } } : {}),
      ...(userId ? { owner: mongoose.Types.ObjectId(userId) } : {}),
    };

    const videos = await Video.aggregate([
        {
            $match: match,
        },

        {
            $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "videosByOwner",
            },
        },

        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                owner: {
                    $arrayElemAt: ["$videosByOwner", 0],
                },
            },
        },

        {
            $sort: {
                [sortBy]: sortType === "desc" ? -1 : 1,
            },
        },

        {
            $skip: (page - 1) * parseInt(limit),
        },

        {
            $limit: parseInt(limit),
        },
    ]);

    if (!videos?.length) {
      throw new ApiError(404, "Videos are not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});


const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!title.trim()){
        throw new ApiError(401, "Title cannot be empty")
    }

    const videofileLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if(!req.files?.videoFile?.[0]){
        throw new ApiError(401,"videoFile is required")
    }
    if(!req.files?.thumbnail?.[0]){
        throw new ApiError(401,"thumbnail is required")
    }

    const videofile = await uploadOnCloudinary(videofileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!videofile){
        throw new ApiError(401,"videoFile upload failed")
    }
    if(!thumbnail){
        throw new ApiError(401,"thumbnail upload failed")
    }
    // const video = {videofile,thumbnail,owner:req.user._id,title,description,duration:videofile.duration}
    // console.log(videofile)
    
    const video = await Video.create({
        videoFile:videofile.url,
        thumbnail:thumbnail.url,
        owner:req.user._id,
        title,
        description,
        duration:videofile.duration
    })
    return res
    .status(200)
    .json(new ApiResponse(200,video,"Video uploaded successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    console.log(videoId)
    
    if(!videoId.trim()){
        throw new ApiError(401,"Video id is empty")
    }

    const video = await Video.findById(videoId)
    
    if(!video){
        throw new ApiError(404,"Video Not Found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,video,"video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {title,description} = req.body
    const thumbnailLocalPath=req.file?.path

    console.log(thumbnailLocalPath)

    if(!title || !description || !thumbnailLocalPath){
        throw new ApiError(401,"all field are required")
    }

    const newthumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    const video = await Video.findByIdAndUpdate(videoId,{
        thumbnail:newthumbnail.url,
        title:title,
        description:description
    })

    const oldthumbnail = video.thumbnail
    await DeleteFromCloudinary(oldthumbnail.split("/").pop().split(".")[0])

    video.thumbnail=newthumbnail.url
    video.title=title
    video.description=description

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        video,
        "Data updated successfully"
    ))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if(!videoId.trim()){
        throw new ApiError(401,"Video id is empty")
    }

    const video = await Video.findByIdAndDelete(videoId)

    console.log(video.videoFile.split("/").pop().split(".")[0])
    console.log(video.thumbnail.split("/").pop().split(".")[0])
    await DeleteFromCloudinary(video.videoFile.split("/").pop().split(".")[0],"video")
    await DeleteFromCloudinary(video.thumbnail.split("/").pop().split(".")[0])

    return res
    .status(200)
    .json(new ApiResponse(200,video,"video fetched successfully"))
    
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Find the video
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Toggle the published status
    video.isPublished = !video.isPublished;
    await video.save();

    return res
    .status(200)
    .json(new ApiResponse(200,video,"video fetched successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
