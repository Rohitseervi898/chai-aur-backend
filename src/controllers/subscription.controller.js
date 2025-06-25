import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleSubscription = asyncHandler(async(req,res)=>{
    const { channelId } = req.params

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(402, "Invalid id");
    }

    if(channelId==req.user._id){
        throw new ApiError(400,"Cannot subscribe itsdelf")
    }

    const subscribed = await Subscription.findOne({channel:channelId})

    if(subscribed){
        await Subscription.findOneAndDelete({channel:channelId})
        return res.status(200).json(new ApiResponse(200,null,"unsubscribed"))
    }
    else{
        const subscribe=await Subscription.create({
            channel:channelId,
            subscriber:req.user._id
        })
        return res.status(200).json(new ApiResponse(200,subscribe,"subscribed"))
    }
})

const getUserChannelSubscribers = asyncHandler(async(req,res)=>{
    const {channelId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(402, "Invalid id");
    }

    const subscribers = await Subscription.find({
        channel:channelId
    })

    return res.status(200).json(new ApiResponse(200,subscribers,"subscribers fetched successfully"))
})

const getSubscribedChannels = asyncHandler(async(req,res)=>{
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(402, "Invalid id");
    }

    const subscribedchannels = await Subscription.find({
        subscriber:channelId
    })

    return res.status(200).json(new ApiResponse(200,subscribedchannels,"Subscribed Channel fetched successfully"))
})

export {
    toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscribers
}