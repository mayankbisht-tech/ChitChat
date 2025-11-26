const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const emailToSocketId = new Map();
const socketIdToEmail = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("room:join", ({ email, room }) => {
    
    emailToSocketId.set(email, socket.id);
    socketIdToEmail.set(socket.id, email);
    io.to(room).emit('user:joined',{email,id:socket.id})
    
    socket.join(room);

    
    io.to(socket.id).emit("room:join", { email, room });
    console.log(`${email} joined room ${room}`);
  });

  socket.on("user:join",({to,offer})=>{
    io.to(to).emit("incoming:call",{from:socket.id,offer})
  })

  socket.on("call:accepted",({to,ans})=>{
    io.to(to).emit("call:accepted",{from:socket.id,ans})
  })

  socket.on("ice-candidate", ({to, candidate}) => {
    io.to(to).emit("ice-candidate", {from: socket.id, candidate});
  })

  socket.on("disconnect", () => {
    const email = socketIdToEmail.get(socket.id);
    console.log("Socket disconnected:", socket.id, email);

    emailToSocketId.delete(email);
    socketIdToEmail.delete(socket.id);
  });
});

server.listen(8000, () => {
  console.log("Server running on port 8000");
});
