import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { ApiError } from "./ApiError.js";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        
        // Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.log("File does not exist:", localFilePath);
            return null;
        }

        //upload the file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })

        console.log(response)
        
        // Remove file from local storage after successful upload
        fs.unlinkSync(localFilePath);
        
        // console.log("File uploaded to cloudinary:", response.url);
        return response;
    } catch(error) {
        console.error("Error uploading to cloudinary:", error.message);
        // Remove file from local storage if it exists
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}

const DeleteFromCloudinary= async (public_id,type="image")=>{
    const done = await cloudinary.uploader.destroy(public_id,{resource_type:type})
    if(!done){
        throw new ApiError(500,"Not able to delete")
    }
}

export {uploadOnCloudinary,DeleteFromCloudinary}