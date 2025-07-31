import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
  photo:{
    type:String,
    required:true
  },
  owner_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:[true,"owner id required"]
  },
  captions:{
    type:String,
    trim:true,
    lowercase:true,
    maxlength:[1000,"maximum character allowed for caption is 1000"]
  }
},{
  timestamps:true
}) 

const Post=mongoose.model("Post",postSchema);

postSchema.index({owner_id:1},{required:true})

export default Post

