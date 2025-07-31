import mongoose from "mongoose";

const messageSchema=new mongoose.Schema(
{
sender:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
},
receiver:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
},
message:{
type:String,
required:true
},
status:{
  type:String,
  enum: ['sent', 'seen'],
  default:"sent"
},
seenAt:{
  type:Date,
  default:null
}

},
{timestamps:true}
)

export  const Message=mongoose.model("Message",messageSchema)



