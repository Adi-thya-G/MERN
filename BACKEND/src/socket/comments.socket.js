import { Comment } from "../model/comments.models.js"

export async function newComments(data,socket)
{ 
  const user_id=socket.user?._id
 const newComment=await Comment.create({
    post_id:data?.post_id,
    comments:data?.comments,
    user_id:user_id
  })

const detailedCommnet=await Comment.aggregate([{
  $match:{
    _id:newComment?._id
    }
}
,
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
])
return detailedCommnet[0]

}