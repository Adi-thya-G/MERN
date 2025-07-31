import { Message } from "../model/messages.models.js";
import asyncHandler from "../util/asyncHandler.js";
import io from '../index.js'
import ApiResponse from "../util/ApiResponse.js";
import mongoose, { isObjectIdOrHexString } from "mongoose";
import ApiErrors from "../util/ApiErros.js";
import client from "../client.js";
import {User} from '../model/users.models.js'
 const allFriends = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const messages = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: user._id },
          { receiver: user._id }
        ]
      }
    },
    {
      $project: {
        friendId: {
          $cond: [
            { $eq: ["$sender", user._id] },
            "$receiver",
            "$sender"
          ]
        }
      }
    },
    {
      $group: {
        _id: "$friendId"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "friend"
      }
    },
    { $unwind: "$friend" },

    // 👇 Lookup to count unread messages from this friend to current user
    {
      $lookup: {
        from: "messages",
        let: { friendId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$sender", "$$friendId"] },
                  { $eq: ["$receiver", user._id] },
                  { $eq: ["$status", "sent"] } // adjust if your unread logic is different
                ]
              }
            }
          },
          {
            $count: "unreadCount"
          }
        ],
        as: "unreadData"
      }
    },
    {
      $addFields: {
        unreadCount: {
          $cond: [
            { $gt: [{ $size: "$unreadData" }, 0] },
            { $arrayElemAt: ["$unreadData.unreadCount", 0] },
            0
          ]
        }
      }
    },
    {
      $project: {
        _id: "$friend._id",
        username: "$friend.username",
        bio: "$friend.bio",
        profile: "$friend.profile",
        unreadCount: 1
      }
    }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Friend list with unread counts"));
});


const getAllMessageOfId = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user_id = req.user?._id;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiErrors(401, "Invalid or missing ID"));
  }

  const otherUserId = new mongoose.Types.ObjectId(id);
  const currentUserId = new mongoose.Types.ObjectId(user_id);

  const messages = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: currentUserId, receiver: otherUserId },
          { sender: otherUserId, receiver: currentUserId }
        ]
      }
    },
    {
      $addFields: {
        direction: {
          $cond: [{ $eq: ["$sender", currentUserId] }, "sent", "received"]
        }
      }
    },
    {
      $sort:{
        createdAt:-1
      }
    },
    {
      $limit:50
    }
    
    
    
  ])

   let receiverData=await User.findById(otherUserId).select("-password -refreshToken -email -__v")
   const socket_id=await client.get(`user:${otherUserId.toString()}:socket_id`)
    let online=!!socket_id
   receiverData=receiverData.toObject()
   receiverData.isOnline=online

  return res.status(200).json(
    new ApiResponse(200, {receiverData,messages}, "All messages between the users with direction")
  );
});

const search=asyncHandler(async(req,res,next)=>{
const search=req.query.search
const user=req.user
console.log("Search query:", search);
if(search)
{
const searchList = await User.aggregate([
  {
    $search: {
      index: "default",
      autocomplete: {
        query: search,
        path: "username",
        fuzzy: {
          maxEdits: 1
        }
      }
    }
  },
  {
    $lookup: {
      from: "messages",
      let: { friendId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$sender", "$$friendId"] },
                { $eq: ["$receiver", user._id] },
                { $eq: ["$status", "sent"] }
              ]
            }
          }
        },
        { $count: "unreadCount" }
      ],
      as: "unreadData"
    }
  },
  {
    $addFields: {
      unreadCount: {
        $cond: [
          { $gt: [{ $size: "$unreadData" }, 0] },
          { $arrayElemAt: ["$unreadData.unreadCount", 0] },
          0
        ]
      }
    }
  },
  {
    $project: {
      _id: 1,
      username: 1,
      bio: 1,
      profile: 1,
      unreadCount: 1
    }
  }
]);




console.log(searchList)

   return res.status(200).json(new ApiResponse(200,searchList,"all search list"))
}
else{
  
   const messages = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: user._id },
          { receiver: user._id }
        ]
      }
    },
    {
      $project: {
        friendId: {
          $cond: [
            { $eq: ["$sender", user._id] },
            "$receiver",
            "$sender"
          ]
        }
      }
    },
    {
      $group: {
        _id: "$friendId"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "friend"
      }
    },
    { $unwind: "$friend" },

    // 👇 Lookup to count unread messages from this friend to current user
    {
      $lookup: {
        from: "messages",
        let: { friendId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$sender", "$$friendId"] },
                  { $eq: ["$receiver", user._id] },
                  { $eq: ["$status", "sent"] } // adjust if your unread logic is different
                ]
              }
            }
          },
          {
            $count: "unreadCount"
          }
        ],
        as: "unreadData"
      }
    },
    {
      $addFields: {
        unreadCount: {
          $cond: [
            { $gt: [{ $size: "$unreadData" }, 0] },
            { $arrayElemAt: ["$unreadData.unreadCount", 0] },
            0
          ]
        }
      }
    },
    {
      $project: {
        _id: "$friend._id",
        username: "$friend.username",
        bio: "$friend.bio",
        profile: "$friend.profile",
        unreadCount: 1
      }
    }
  ]);
   return res
    .status(200)
    .json(new ApiResponse(200, messages, "Friend list with unread counts"));
}





})
const markMessageAsSeen=asyncHandler(async(req,res,next)=>{
const user_id=req?.user?._id
const {id}=req.params

const seenTimeStap=new Date(Date.now() + (5.5 * 60 * 60 * 1000))
await Message.updateMany(
  { sender: id, receiver: user_id ,status:"sent"},
  { $set: { status: "seen", 
      seenAt:seenTimeStap
  } }
);

const response=await Message.find({
  sender: id, receiver: user_id ,seenAt:seenTimeStap
}).select("_id status seenAt")

const senderSocketId=await client.get(`user:${id}:socket_id`)

if(senderSocketId)
{
  console.log(senderSocketId)
  io.to(senderSocketId).emit('seen_status',response)
}



res.status(200).json(new ApiResponse(200,[],"Message marked as seen"))

})


export  {allFriends,getAllMessageOfId,markMessageAsSeen,search}

