// server.js (backend)
import dotenv from 'dotenv';
import app from './app.js';
import { databaseConnection } from './db/index.js';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import socketVerify from './middleware/socketVerify.middleware.js';
import client from './client.js';
import { newComments } from './socket/comments.socket.js';
import {addlikes,removelikes} from './socket/likes.socket.js'
import {Chat} from './socket/chat.socket.js'
 dotenv.config();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }
});

io.use(socketVerify)
io.on('connection', async(socket) => {
 await client.set(`user:${socket.user._id}:socket_id`,socket.id)
  io.emit(`${socket.user._id}_isOnline`,{isOnline:true})


  socket.on("newcomments",async(data)=>{
    let newdata= await newComments(data,socket)
    io.emit(`comments_${data.post_id}`,newdata)
  })


  socket.on("newlikes",async(data)=>{
    const count=await addlikes(data,socket)
    console.log(count)
    io.emit(`likes_${data.post_id}`,count)
  })

  socket.on(`removelikes`,async(data)=>{
  const count= await removelikes(data,socket)
  console.log(count)
  io.emit(`likes_${data.post_id}`,count)
  })
 socket.on("receiver_message", async (data, call) => {
  try {
    const [senderMessage, receiverMessage] = await Chat(data, socket);

    // Emit to sender
    io.to(socket.id).emit(receiverMessage?.receiver.toString(), senderMessage);
    io.to(socket.id).emit(`new_message_sender`,senderMessage?.user)

    // Emit to receiver if online
    const receiver_socket_id = await client.get(`user:${receiverMessage?.receiver.toString()}:socket_id`);

    if (receiver_socket_id) {
      const curentRouter=await client.get(`user:${receiverMessage?.receiver.toString()}:currentRouter`)
      console.log(curentRouter)
      if(curentRouter=='/api/v1/chats')
      {
        io.to(receiver_socket_id).emit(receiverMessage?.sender.toString(), receiverMessage);
        io.to(receiver_socket_id).emit('new_message_receiver',receiverMessage.user)
      }
      else{
        io.to(receiver_socket_id).emit('message_Notification',receiverMessage)
      }
       call({ success: true, message: "Message delivered successfully" ,status:"seen"});
    }

    // ✅ Acknowledge the client
   
  } catch (error) {
    console.error("Error handling receiver_message:", error);
    // ❗ Send error to client
    call({ success: false, message: "Failed to deliver message", error: error.message });
  }
});
socket.on(`typeIndictor`,async(data)=>{
 const receiver_socket_id=await client.get(`user:${data?.receiver}:socket_id`)
 if(receiver_socket_id)
 {
  io.to(receiver_socket_id).emit('typing_indicator',data)
 }
})
 
socket.on('disconnect',async(reason)=>{
 io.emit(`${socket.user._id}_isOnline`,{isOnline:false})
 await client.del(`user:${socket.user._id}:socket_id`)
 await client.del(`user:${socket.user._id}:currentRouter`)
})
});





// db connection
databaseConnection()
  .then(() => {
    const PORT = process.env.PORT ;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection failed:", error);
    process.exit(1);
  });

  export default io
  

 