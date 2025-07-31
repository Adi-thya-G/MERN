import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:[true,"Username is required"]
  },
  email:{
    type:String,
    required:[true,"Email is required"],
   

  },
  password:{
    type:String,
    required:[true,"Password is required"],
  },
  profile:{
    type:String,
    default:""
  },
  bio:{
    type:String,
    default:""
  },
  refreshToken:{
    type:String,
  },
  resetToken:{
    type:String
  }

},{timestamps:true});

userSchema.index({ username: 1  }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: "text", bio: "text" });


//middleware to hash password before saving
userSchema.pre("save",async function (next){
  if(!this.isModified("password"))return next();
   
  this.password =await bcrypt.hash(this.password, 10);
  next();
})

userSchema.methods.isPasswordMatch = async function (password) {
if(password)
  return await bcrypt.compare(password, this.password);

}
userSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
    _id: this._id,
    }
,process.env.REFRESH_TOKEN_SECRET,
{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY ,  
}
)
  
}
userSchema.methods.generateAccessToken=function (){
  return jwt.sign(
    {
      id:this._id
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn:process.env.ACCESS_EXPIRE
    }
  )
}
userSchema.methods.generateResetToken=async function()
{
 return await jwt.sign(
    {
      id:this._id
    },
    process.env.RESET_TOKEN,
    {
      expiresIn:process.env.RESET_TOKEN_EXPIRE
    }
  )
}

export const User = mongoose.model("User", userSchema);