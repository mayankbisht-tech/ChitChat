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
