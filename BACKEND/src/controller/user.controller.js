import { User } from "../model/users.models.js";
import ApiErrors from "../util/ApiErros.js";
import ApiResponse from "../util/ApiResponse.js";
import asyncHandler from "../util/asyncHandler.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import {uploadOncloudinary} from '../util/cloudinary.js'
import mongoose from "mongoose";
import  Post from '../model/posts.models.js'
import nodemailer from 'nodemailer'
import { Follower } from "../model/followers.models.js";
import {Like} from '../model/likes.models.js'
const generatetoken = async (id) => {
        const user = await User.findById(id).select("-password");
        const refreshToken = await user.generateRefreshToken();
        const accessToken=await user.generateAccessToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return {
            refreshToken,
             accessToken
          }
}

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  if ([username, email, password].some((filed) => filed?.trim() === "")) {
    throw new ApiErrors(400, "All fields are required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (user != null) {
    if (user.username === username) {
      throw new ApiErrors(400, "Username already exists");
    } else if (user.email === email) {
      throw new ApiErrors(400, "Email already exists");
    }
  }
  const newuser = await User.create({
    username,
    email,
    password,
  });
 
  return res
    .status(201)
    .json(new ApiResponse(201, [], "User created successfully", true));
});

const login=asyncHandler(async(req,res,next)=>{
  const {loginFiled,password}=req.body;
  
  if([loginFiled,password].some((ele)=>ele?.trim()==""))
  {
      throw new ApiErrors(404,"all filed is required")
  }


  const user= await User.findOne({
    $or:[
      {username:loginFiled},
      {email:loginFiled}
    ]
  })
  if(!user)
  {
   
  throw new ApiErrors(404,"user not found")
  }
  const isPasswordMatch=await user.isPasswordMatch(password);
  
  if(!isPasswordMatch)
  {
   throw new ApiErrors(401,"invalid username and password")
  }
  const {refreshToken,accessToken}=await generatetoken(user._id)
   
    const option={
      httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    path: '/',
    }
   
  return res.status(200)
  .cookie("accessToken",accessToken,option)
  .cookie("refreshToken",refreshToken,option)
  .json(new ApiResponse(200,user,"user login",true))

})
const getCurrentUser=asyncHandler(async(req,res)=>{
  const id=req?.user?._id;
  const user=await User.findById(id).select("-password -refreshToken")
  if(!user)
    {
      throw new ApiErrors(401,"invalid user")
    }      
  return res.status(200)
  .json(new ApiResponse(200,user,"current user info",true))
})
const logout=asyncHandler(async(req,res,next)=>{
  const id=req.user._id;
  const user=await User.findByIdAndUpdate(id,
   {
     $set:{
      refreshToken:undefined
    }
   },
   {
    new:true
   }).select("-password -refreshToken");
  if(!user)
  {
    throw new ApiErrors(401,"unauthorized acction");
  }
  const options={
    httpOnly:true, // it only modifief by server
    secure:true,
  }
  return res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,[],"logout successfully"))
})
const updateUserDeatils=asyncHandler(async(req,res,next)=>{
const file=req.file
const bio=req.body?.bio
if(!file && !bio)
  throw new ApiErrors(500,"no field for update")

const user=await User.findById(req.user._id).select("-password -refreshToken")
if(file)
{
const res=await uploadOncloudinary(file?.path)
user.profile=res.url
}
if(bio)
{
  user.bio=bio;
}
await user.save({validateBeforeSave:false})

return res.status(200)
.json(new ApiResponse(200,[],"user profile updated"))
})
const createResetToken=asyncHandler(async(req,res,next)=>{
 
  const {email}=req.body;
  
  if(!email)
    throw new ApiErrors(404,"unauthorized accesss")
  const user=await User.findOne({email}).select("-password -refreshToken")
  if(!user)
    throw new ApiErrors(401,"unauthorized access")
  const resetToken=await user.generateResetToken()
  user.resetToken=resetToken
  await user.save({validateBeforeSave:false})
  const url=`http://localhost:5700/forget-password/${resetToken}`

  const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "adithyakg31@gmail.com",
    pass: "fqpn wggu tfke dswa",
  },
});
const info = await transporter.sendMail({
    from: '"adithya" <adithyakg31@gmail.com>',
    to: "adithyakg31@gmail.com",
    subject: "Hello ✔",
    text: "Hello world?", // plain‑text body
    html: `<b>Hello world? ${url} </b>`, // HTML body
  });
 
  console.log("Message sent:", info.messageId);
  return res.status(200)
  .json(new ApiResponse(200,[],"link send email"))
})

const verifyResetToken1=asyncHandler(async(req,res,next)=>{
  const user=req.user
  return res.json(new ApiResponse(200,[],"valid token "))
})

const changePassword=asyncHandler(async(req,res,next)=>{
  const {password,confirmPassword}=req.body
  const id=req.user._id
  if(password!==confirmPassword)
  {
    throw new ApiErrors(404,"password and confirm password should be same")
  }
   const user=await User.findById(id)
   if(!user)
    throw new ApiErrors(404,"invalid user")
  user.password=password;
  user.resetToken=undefined
  await user.save({validateBeforeSave:true})
  return res.status(200)
  .json(new ApiResponse(200,"password has been changed"))
})

const createAccessToken=asyncHandler(async(req,res,next)=>{
  const {accessToken,refreshToken}=req?.cookies;
  
  if(!refreshToken || refreshToken==undefined)
  {
    throw new ApiErrors(401,"unauthrize access")
  }
  const decode=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
  const user=await User.findById(decode?._id).select("-password -resetToken")
  if(!user)
    throw new ApiErrors(400,"invalid token")
  const {newAccessToken,newRefreshToken}=await generatetoken(user?._id)
 const option={
      httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    path: '/',
    }
    
   return res.status(200)
   .cookie("accessToken",newAccessToken,option)
   .cookie("refreshToken",newRefreshToken,option)
   .json(new ApiResponse(200,[],"access token updated"))
})

const userHome = asyncHandler(async (req, res, next) => {
  const user = req?.user;
  if (!user) {
    throw new ApiErrors(400, "Invalid user");
  }

  // 🔍 Step 1: Get following list
  const followingDoc = await Follower.findOne({ followers: user._id }).lean();
  const following = Array.isArray(followingDoc?.following) ? followingDoc.following : [];

  // 🔁 Step 2: Aggregate feed
 const home = await Post.aggregate([
    // -------------------- FOLLOWING USERS' POSTS --------------------
    {
      $match: {
        owner_id: { $in: following, $ne: user._id }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner_id",
        foreignField: "_id",
        as: "ownerInfo"
      }
    },
    { $unwind: "$ownerInfo" },
    {
      $addFields: {
        ownerUsername: "$ownerInfo.username",
        ownerProfile: "$ownerInfo.profile"
      }
    },
    {
      $lookup: {
        from: "likes",
        let: { postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$post_id", "$$postId"] }
            }
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              likedByCurrentUser: {
                $addToSet: {
                  $cond: [
                    { $eq: ["$user_id", user._id] },
                    true,
                    "$$REMOVE"
                  ]
                }
              }
            }
          }
        ],
        as: "likeStats"
      }
    },
    {
      $lookup: {
        from: "comments",
        let: { postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$post_id", "$$postId"] }
            }
          },
          { $count: "count" }
        ],
        as: "commentStats"
      }
    },
    {
      $addFields: {
        likes: {
          $ifNull: [{ $arrayElemAt: ["$likeStats.count", 0] }, 0]
        },
        isLiked: {
          $gt: [
            {
              $size: {
                $ifNull: [
                  { $arrayElemAt: ["$likeStats.likedByCurrentUser", 0] },
                  []
                ]
              }
            },
            0
          ]
        },
        commentCount: {
          $ifNull: [{ $arrayElemAt: ["$commentStats.count", 0] }, 0]
        },
        feedType: "following"
      }
    },
    {
      $project: {
        likeStats: 0,
        commentStats: 0,
        ownerInfo: 0
      }
    },

    // -------------------- STRANGER POSTS --------------------
    {
      $unionWith: {
        coll: "posts",
        pipeline: [
          {
            $match: {
              owner_id: { $nin: [...following, user._id] }
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "owner_id",
              foreignField: "_id",
              as: "ownerInfo"
            }
          },
          { $unwind: "$ownerInfo" },
          {
            $addFields: {
              ownerUsername: "$ownerInfo.username",
              ownerProfile: "$ownerInfo.profile"
            }
          },
          {
            $lookup: {
              from: "likes",
              let: { postId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$post_id", "$$postId"] }
                  }
                },
                {
                  $group: {
                    _id: null,
                    count: { $sum: 1 },
                    likedByCurrentUser: {
                      $addToSet: {
                        $cond: [
                          { $eq: ["$user_id", user._id] },
                          true,
                          "$$REMOVE"
                        ]
                      }
                    }
                  }
                }
              ],
              as: "likeStats"
            }
          },
          {
            $lookup: {
              from: "comments",
              let: { postId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$post_id", "$$postId"] }
                  }
                },
                { $count: "count" }
              ],
              as: "commentStats"
            }
          },
          {
            $addFields: {
              likes: {
                $ifNull: [{ $arrayElemAt: ["$likeStats.count", 0] }, 0]
              },
              isLiked: {
                $gt: [
                  {
                    $size: {
                      $ifNull: [
                        { $arrayElemAt: ["$likeStats.likedByCurrentUser", 0] },
                        []
                      ]
                    }
                  },
                  0
                ]
              },
              commentCount: {
                $ifNull: [{ $arrayElemAt: ["$commentStats.count", 0] }, 0]
              },
              feedType: "stranger"
            }
          },
          {
            $project: {
              likeStats: 0,
              commentStats: 0,
              ownerInfo: 0
            }
          }
        ]
      }
    },

    // -------------------- SORT ALL POSTS --------------------
    { $sort: { createdAt: -1 } }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, home, "Feed data fetched"));
});

const viewprofile = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const currentUser = req?.user;
  console.log(id)
  if (!id || !currentUser) {
    throw new ApiErrors(400, "Invalid ID or not logged in");
  }

  
   
  const viewedUserId = new mongoose.Types.ObjectId(id);
  const currentUserId = new mongoose.Types.ObjectId(currentUser._id);

  // 1. Check if user exists and get post count
  const userData = await User.aggregate([
    {
      $match: { _id: viewedUserId }
    },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "owner_id",
        as: "post"
      }
      
    },
    {
      $addFields: {
        post_count: { $size: "$post" }
      }
    },
    {
      $project: {
        _id: 1,
        profile: 1,
        bio:1,
        username: 1,
        post_count: 1
      }
    }
  ]);

  if (userData.length === 0) {
    throw new ApiErrors(404, "User not found");
  }

  // 2. Follower count (who follows this user)
  const followerCount = await Follower.countDocuments({
    following: viewedUserId
  });

  // 3. Following count (whom this user follows)
  const followingCount = await Follower.countDocuments({
    followers: viewedUserId
  });

  // 4. Does current user follow this user?
  const isFollowing = await Follower.exists({
    followers: currentUserId,
    following: viewedUserId
  });

  // Final output
  const profileData = {
    ...userData[0],
    follower_count: followerCount,
    following_count: followingCount,
    is_following: Boolean(isFollowing)
  };

  return res
    .status(200)
    .json(new ApiResponse(200, profileData, "User profile fetched"));
});



export { registerUser,login ,getCurrentUser,logout,updateUserDeatils,createResetToken,verifyResetToken1,changePassword,createAccessToken,userHome ,viewprofile};
