import fs from "fs";

import {v2 } from "cloudinary";

 
const uploadOncloudinary =async(localFilePath)=>{
  v2.config({
api_key:process.env.CLOUDINARY_API_KEY,
api_secret:process.env.CLOUDINARY_API_SECRET,
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
})

  try {
    if(!localFilePath)
    {
      return null;
    }
    const res=await v2.uploader.upload(localFilePath,{
      resource_type: "auto",

    })
    fs.unlinkSync(localFilePath)
    return res
  } catch (error) {
    console.log(error)
         fs.unlinkSync(localFilePath)
         return null
  }
}
export {uploadOncloudinary}