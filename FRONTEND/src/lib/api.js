import { axiosInstance } from "./axios";
//user crud operations
export const login=async(form)=>{
  const response=await axiosInstance.post("users/login",form)
  return response
}

export const signup=async(form)=>{
  const response=await axiosInstance.post("users/register",form)
  return  response

}

// update profile and bio

export const profileUpdate=async(form)=>{
return await axiosInstance.post("users/updateuserdetails",form,{
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})


}

export const logout=async()=>{
  const response=await axiosInstance.post("users/logout")
  return response
}

export const getCurrentUser=async()=>{
  const response=await axiosInstance.post("users/getcurrentuser")
  return response
}

export const newAccessToken=async()=>{
  const response=await axiosInstance.post("users/generate-accesstoken")
  return response
}
// post curd operation
export const uploadPost=async(form)=>{
  const response=await axiosInstance.post("posts/uploads",form, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})
  return response
}

export const deletePost=async(id)=>{
  const response=await axiosInstance.delete(`posts/delete/${id}`)
  return response
}

export const updatePost=async(form)=>{
  const response=await axiosInstance.patch("posts/updatepost",form)
  return response
}

export const getAllPost=async()=>{
  const response=await axiosInstance.get("posts/allpost")
  return response
}

//follow
export const followAndUnfollow=async(id)=>{
  const response=await axiosInstance.post(`follow/${id}`)
  return response
}
//follower following post count

export const count=async(id)=>{
  const response=await axiosInstance.get(`follow/count/${id}`)
  return response
}
//message

//get all friedn

export const getAllFriends=async()=>{
  return await axiosInstance.post(`chats/allfriends`)
}

export const getAllMessageId=async(id)=>{
const response=await axiosInstance.get(`chats/getallmessage/${id}`)
return response
}

export const home=async()=>{
  const response=await axiosInstance.post('users/home')
  return response
}

export const profile=async(id)=>{
  return await axiosInstance.get(`users/viewprofile/${id}`)
}

export const DetailedComments=async(id)=>{
  console.log(id)
  return await axiosInstance.get(`posts/allcomments/${id}`)
}

// mark as seen api

export const markAsSeen=async(id)=>{
  return await axiosInstance.put(`chats/seen/${id}`)
}

export const searchFunction=async(search)=>{
  return await axiosInstance.get(`chats/searchlist/`,{
    params:{
      search:search
    }
  })
}