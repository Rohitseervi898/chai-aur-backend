import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema({
    comment:{
        type:Schema.Types.ObjectId,
        ref:"Comment",
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    likedBy:{
        type:Schema.Types.ObjectId,
        req:"User"
    },
    tweet:{
        type:Schema.Types.ObjectId,
        req:"User"
    }
},{timestamps:true})

export const Like = mongoose.model("Like",LikeSchema)