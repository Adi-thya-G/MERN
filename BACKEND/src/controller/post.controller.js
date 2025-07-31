import Post from "../model/posts.models.js";
import  asyncHandler from '../util/asyncHandler.js'
import ApiErrors from '../util/ApiErros.js'
import ApiResponse from '../util/ApiResponse.js'
import {uploadOncloudinary} from '../util/cloudinary.js'
import { User } from "../model/users.models.js";
import mongoose from "mongoose";
import { Like } from "../model/likes.models.js";
import { Comment } from "../model/comments.models.js";
const uploadPost=asyncHandler(async(req,res,next)=>{
const file=req.file
const caption=req.body?.caption
if(!file)
  throw new ApiErrors(404,"no file found")

const uploadfile=await uploadOncloudinary(file?.path)
if(uploadfile==null)
  throw new ApiErrors(401,"error occured while uploading file")

const user=await User.findById(req.user?._id)
if(!user)
  throw new ApiErrors("invalid user")

const postDetails=await Post.create({
  photo:uploadfile.url,
  owner_id:user?._id,
  captions:caption
})


return res.status(200)
.json(new ApiResponse(200,postDetails,"uploaded successfuly"))
})

const deletePost=asyncHandler(async(req,res,next)=>{
  const fileId=req.params.fileId
  console.log(fileId)
  if(!fileId)
    throw new ApiErrors(401,"file not found")

  const user_id=req.user._id;
  const file=await Post.findOneAndDelete({
    owner_id:user_id,
    _id:fileId
  })
  if(!file)
    throw new ApiErrors(404,"file not found")

  return res.status(200)
  .json(new ApiResponse(200,[],"post deleted successfully"))

  })

const updatePost=asyncHandler(async(req,res,next)=>{

  const user=req.user;
  const post_id=req.body?.post_id
  const caption=req.body?.caption;
  const file=req?.file;
  const post_data=await Post.findById(post_id)
  if(!post_data)
  {
    throw new ApiErrors(400,"no post found")
  }
  if(!caption&& !file &&(file==undefined&&caption==undefined))
  {
    throw new ApiErrors(400,"some filed is required to update")
  }
if(file)
{
const uploadfile=await  uploadOncloudinary(file.path)
if(uploadfile==null)
{
  throw new ApiErrors(400,"error while uploading file")
}
post_data.photo=uploadfile.url

}
if(caption)
{
post_data.captions=caption;
}
const update_post=await post_data.save({validateBeforeSave:false})
return res.status(200)
.json(new ApiResponse(200,update_post,"post updated successfully"))

})

const allpost=asyncHandler(async(req,res,next)=>{

  const id=req?.user?.id
  if(!id||id==undefined)
  {
    throw new ApiErrors(400,"unauthrozied access")
  }
  
  const post=  await Post.aggregate([
    {
      $match:
      {
        owner_id:new mongoose.Types.ObjectId(id)
      }
    },{
      $lookup:{
        from:"likes",
        localField:"_id",
        foreignField:"post_id",
        as:"likes"
      }
    },
    {
      $lookup:{
        from:"comments",
        localField:"_id",
        foreignField:"post_id",
        as:"comments"
      }
    }
    ,{
  $addFields: {
    likesCount: { $size: "$likes" },
    commentsCount:{$size:"$comments"}
  }
},{
  $project:{
    _id:1,
    likesCount:1,
    captions:1,
    createdAt:1,
    updatedAt:1,
    commentsCount:1,
    photo:1
  }
}
  
  ])
return res.status(200)
.json(new ApiResponse(200,post))
})

const allComments=asyncHandler(async(req,res,next)=>{
  const {id}=req.params
const comment = await Comment.aggregate([
  {
    $match: {
      post_id: new mongoose.Types.ObjectId(id)
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user_data"
    }
  },
  {
    $unwind: "$user_data"
  },
  {
    $project: {
      _id: 1,
      comments: 1,
      createdAt: 1,
      "user_id": "$user_data._id",
      "username": "$user_data.username",
      "profile": "$user_data.profile"
    }
  }
]);
    res.status(200).json(new ApiResponse(200,comment,"all coment"))
})


export{
  uploadPost,
  deletePost,
  updatePost,
  allpost,
  allComments
}