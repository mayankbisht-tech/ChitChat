import React, { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";

const LobbyScreen=()=>{
    const [email,setEmail]=useState("")
    const navigate=useNavigate()
    const [room,setRoom]=useState("")
const socket=useSocket()
const handleSubmitForm=useCallback((e)=>{
    e.preventDefault();
    if(socket!==null){
        socket.(emit as any)('room:join',{email,room})
        console.log({
            email,room
        })
        console.log(socket)
    } 
},[room,email,socket])
const handleJoinRoom=useCallback((data)=>{
    const {email,room}=data;
    navigate(`/room/${room}`)
    console.log(room,email)
},[socket])
useEffect(()=>{
    socket.on('room:join',handleJoinRoom)
    return ()=>{
        socket.off("room:join",handleJoinRoom)
    }
},[socket,handleJoinRoom])
return <div>
        <h1>
            Lobby
        </h1>
        <form onSubmit={handleSubmitForm}>
            <label htmlFor="email"> Email Id</label>
        <input onChange={e=>setEmail(e.target.value)} value={email} type="email" id="email" className="type" />
        <br />
        <label htmlFor="room"> Room No</label>
        <input onChange={e=>setRoom(e.target.value)} value={room} type="text" id="room" className="type" />
        <br />
        <button>Submit</button>
        </form>
        
    </div>
}
export default LobbyScreen