import { Like } from "../model/likes.models.js";
export async function addlikes(data,socket)
{  
const newLikes= await Like.create(
    {
      post_id:data?.post_id,
      user_id:socket.user._id  
    }
)

const likesCount=await Like.countDocuments({post_id:newLikes?.post_id})
return {
  post_id:newLikes?.post_id,
  likesCount,
  isLiked:true
}
}

export async function removelikes(data,socket)
{
 const removeLikes= await Like.findOneAndDelete({
    post_id:data?.post_id,
    user_id:socket.user.id
  })

const likesCount=await Like.countDocuments({
  post_id:removeLikes?.post_id
})
return {
   post_id:removeLikes?.post_id,
   likesCount,
   isLiked:false
}
}