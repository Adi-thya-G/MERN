import ApiErrors from "../util/ApiErros.js";
import ApiResponse from "../util/ApiResponse.js";
import asyncHandler from "../util/asyncHandler.js";
import { Follower } from "../model/followers.models.js";
import { User } from "../model/users.models.js";
import mongoose from "mongoose";
import Post from "../model/posts.models.js";


const follow = asyncHandler(async (req, res, next) => {
  const user = req?.user;
  const id = req?.params?.id;

  if (!user || !id) {
    throw new ApiErrors(400, "Invalid data");
  }

  if (id === user._id.toString()) {
    throw new ApiErrors(400, "You cannot follow yourself");
  }

  const findUser = await User.findById(id);
  if (!findUser) {
    throw new ApiErrors(404, "User to follow not found");
  }

  const findFollower = await Follower.findOne({
    followers:new mongoose.Types.ObjectId(user._id),
    following: new mongoose.Types.ObjectId(id)
  });
   console.log(findFollower,"dds")
  if (findFollower!=null) {
    await findFollower.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unfollowed successfully"));
  } else {
    const newFollower = await Follower.create({
      followers: user._id,
      following: id
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newFollower, "Followed successfully"));
  }
});

const countFollowerAndFollowingAndPost=asyncHandler(async(req,res,next)=>{
  const id=req?.params?.id
  console.log(id)
  if(id==undefined|| !id)
  {
    throw new ApiErrors(400,"invalid id param")
  }
  const user=await User.findById(id)

  if(!user || user==null)
  {
    throw new ApiErrors(400,"invalid user")
  }
  const [followers,followings,post]=await Promise.all([
   Follower.countDocuments({
    following:user?._id
   }),
   Follower.countDocuments({
    followers:user?._id
   }),
   Post.countDocuments({
    owner_id:user?._id
   })
  ])
  
  return res.status(200)
  .json(new ApiResponse(200,
    {
    followers,
    followings,
    post
  },))

})



export { follow, countFollowerAndFollowingAndPost};
