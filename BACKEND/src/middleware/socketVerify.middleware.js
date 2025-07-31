import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import ApiErrors from '../util/ApiErros.js';
import { User } from '../model/users.models.js';

const socketVerify = async(socket, next) => {
  try {
   
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader && cookieHeader==undefined) return next(new ApiErrors(401, "Unauthorized No cookie"));

    const parsed = cookie.parse(cookieHeader);
    const { accessToken } = parsed;
    if (!accessToken) return next(new ApiErrors(401, "Unauthorized No access token"));

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    const user=await User.findById(decoded?.id)
    if(!user)
    {
      return next(new ApiErrors(400,"invalid user"))
    }
    socket.user = user; 
    next();

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiErrors(401, "Token expired"));
    }
    return next(new ApiErrors(401, "Invalid token"));
  }
};

export default socketVerify;
