import mongoose from "mongoose";

const commentSchema=new mongoose.Schema(
{
post_id:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Post",
  required:true
},
user_id:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
},
comments:{
  type:String,
  required:true
}


},{timestamps:true})

commentSchema.index({post_id:1,user_id:1},{unique:true})

export const Comment=mongoose.model("Comment",commentSchema)