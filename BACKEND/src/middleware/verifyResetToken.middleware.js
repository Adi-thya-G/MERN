import { User } from "../model/users.models.js";
import ApiErrors from "../util/ApiErros.js";
import asyncHandler from "../util/asyncHandler.js";
import jwt from 'jsonwebtoken'
const verifyResetToken=asyncHandler(async(req,res,next)=>{
 
  const reset_token=req.params.resetToken;
  if(!reset_token)
    throw new ApiErrors(400,"unauthorized accesss")
  const decode=jwt.verify(reset_token,process.env.RESET_TOKEN);
  const user=await User.findOne({
    _id:decode?.id,
    resetToken:reset_token
  }).select("-password -refreshToken")
  if(!user)
    throw new ApiErrors(404,"invalid link")
  req.user=user
  console.log(user)
  
  next()


})

export  {verifyResetToken}