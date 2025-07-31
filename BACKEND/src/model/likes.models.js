import mongoose from "mongoose";

const likeSchema= new  mongoose.Schema({
  post_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post"
  },
  user_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
},{timestamps:true})

likeSchema.index({post_id:1,user_id:1},{unique:true})

export const Like=mongoose.model("Like",likeSchema)