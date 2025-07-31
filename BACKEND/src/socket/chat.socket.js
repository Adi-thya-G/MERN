import { Message } from "../model/messages.models.js"
import mongoose from "mongoose"; // Needed for ObjectId

export async function Chat(data, socket) {
  const sender_id = socket?.user?._id;
  const receiver_id = data?.receiver;
  const message = data?.message;

  // Create the message
  const newMessage = await Message.create({
    sender: sender_id,
    receiver: receiver_id,
    message: message,
    status: "sent"
  })



  const senderMessage = await Message.aggregate
  (
    [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(newMessage._id) // ✅ Ensure ObjectId type
      }
    },
    {
      $lookup: {
        from: "users", // ✅ Ensure correct collection name
        localField: "receiver",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $addFields: {
        direction: {
          $cond: [
            { $eq: ["$sender", new mongoose.Types.ObjectId(sender_id)] },
            "sent",
            "received"
          ]
        }
      }
    },
    {
      $project: {
        _id:1,
        sender:1,
        receiver:1,
        message:1,
        status:1,
        direction:1,
        createdAt:1,
        updatedAt:1,
        "user.username":1,
        "user._id":1,
        "user.bio":1,
        "user.profile":1
      }
    }
  ]);

  const receiverMessage=await Message.aggregate
  (
    [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(newMessage._id) // ✅ Ensure ObjectId type
      }
    },
    {
      $lookup: {
        from: "users", // ✅ Ensure correct collection name
        localField: "sender",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $addFields: {
        direction:  "received"
      }
    },
    {
      $project: {
        _id:1,
        sender:1,
        receiver:1,
        message:1,
        status:1,
        direction:1,
        createdAt:1,
        updatedAt:1,
        "user.username":1,
        "user._id":1,
        "user.bio":1,
        "user.profile":1
      }
    }
  ]);

  return [senderMessage[0],receiverMessage[0]]

  // Optional: Emit the message to the sender and receiver sockets
  // socket.emit("newMessage", senderMessage[0]);
  // io.to(receiver_id).emit("newMessage", senderMessage[0]);
}
