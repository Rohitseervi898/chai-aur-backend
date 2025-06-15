import mongoose,{Schema} from "mongoose";
import mongooseAgregatePaginate from "mongoose-aggregate-praginate-v2"



const videoSchema = new Schema({
    VideoFile:{
        type:String, //cloudinary url
        required:true,
    },
    thumbmnail:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,
        required:true,
    },
    views:{
        type:Number,
        default:0,
    },
    isPublished:{
        type:Boolean,
        default:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }

},{timestamps:true})

videoSchema.plugin(mongooseAgregatePaginate)

export const Video = mongoose.model("Video",videoSchema);
