import jwt from 'jsonwebtoken';
import asyncHandler from '../util/asyncHandler.js';
import ApiErrors from '../util/ApiErros.js';
import { User } from "../model/users.models.js";
import client from '../client.js';

const verifyjwt=asyncHandler(async(req,res,next)=>{
 const {accessToken,refreshToken}=req.cookies;
 if([accessToken, refreshToken].some((token) => !token || token.trim() === ""))
 {
  throw new ApiErrors(401,"invalid access and refresh token")
 }

const decode= await jwt.verify(accessToken,process.env.ACCESS_TOKEN)

const user =await User.findById(decode?.id).select("-password -refreshToken")

if(!user)
{
  throw new ApiErrors(401,"invalid access token")
}

req.user=user;

client.set(`user:${user?._id}:currentRouter`,req.baseUrl)
 next();

})

export {verifyjwt}