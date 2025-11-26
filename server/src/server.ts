import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db';
import userRouter from './routes/userRoutes'
import messageRouter from './routes/messageRoutes';
import {Server} from "socket.io"
const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: '4mb' }));
app.use(cors());

export const io=new Server(server,{
  cors:{origin:"*"}
})
export const userSocketMap={};


io.on("connection",(socket)=>{
  const userId=socket.handshake.query.userId;
  console.log("User connected",userId);
  if(userId) userSocketMap[userId.toString()]=socket.id

  io.emit("getOnlineUsers",Object.keys(userSocketMap))

  
  socket.on("video-call-request", ({ callerId, receiverId, callerName }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incoming-video-call", {
        callerId,
        callerName,
        socketId: socket.id
      });
    }
  });

  socket.on("video-call-accept", ({ callerId }) => {
    const callerSocketId = userSocketMap[callerId];
    if (callerSocketId) {
      io.to(callerSocketId).emit("video-call-accepted", {
        receiverId: userId
      });
    }
  });

  
  socket.on("video-call-reject", ({ callerId }) => {
    const callerSocketId = userSocketMap[callerId];
    if (callerSocketId) {
      io.to(callerSocketId).emit("video-call-rejected");
    }
  });

  socket.on("video-offer", ({ offer, receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("video-offer", {
        offer,
        callerId: userId
      });
    }
  });

  socket.on("video-answer", ({ answer, callerId }) => {
    const callerSocketId = userSocketMap[callerId];
    if (callerSocketId) {
      io.to(callerSocketId).emit("video-answer", { answer });
    }
  });

  socket.on("ice-candidate", ({ candidate, targetId }) => {
    const targetSocketId = userSocketMap[targetId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("ice-candidate", {
        candidate,
        senderId: userId
      });
    }
  });

  socket.on("video-call-cancelled", ({ targetId }) => {
    const targetSocketId = userSocketMap[targetId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("video-call-cancelled");
    }
  });

  socket.on("end-video-call", ({ targetId }) => {
    const targetSocketId = userSocketMap[targetId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("video-call-ended");
    }
  });

  socket.on("disconnect",()=>{
    console.log("user diconnected",userId)
    delete userSocketMap[userId.toString()];
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
  })
})

app.use('/api/status', (req, res) => {
  res.send({ status: 'Server is running' });
});
app.use("/api/auth",userRouter)
app.use("/api/messages",messageRouter);

async function startServer() {
  await connectDB(process.env.MONGODB_URL || '');

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
