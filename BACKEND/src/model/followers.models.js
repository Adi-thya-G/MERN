import mongoose from "mongoose";

const followerSchema=new mongoose.Schema(
{
  followers:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  following:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  }

},{
  timestamps:true
})

followerSchema.index({followers:1,following:1},{unique:true})

export const Follower=mongoose.model("Follower",followerSchema)