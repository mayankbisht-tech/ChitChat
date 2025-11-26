import React, { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import { io } from "socket.io-client";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type AuthContextType = {
    axios: typeof axios;
    token: string | null;
    authUser: any | null;
    onlineUser: any[];
    socket: any | null;
    login: (state: string, credentials: any) => Promise<void>;
    logout: () => void;
    updateProfile: (body: any) => Promise<void>;
};
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token,setToken]=useState<string | null>(localStorage.getItem("token"))
    const [authUser,setAuthUser]=useState<any>(null);
    const[onlineUser,setOnlineUser]=useState<any[]>([])
    const [socket,setSocket]=useState<any>(null)

    const checkAuth=async ()=>{
        try {
            const {data}=await axios.get("/api/auth/check")
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error: any) {
            if (error?.response?.status !== 401) {
                const message = error instanceof Error ? error.message : String(error);
                toast.error(message)
            }
            localStorage.removeItem("token");
            setToken(null);
        }
    }


    const login=async(state: string, credentials: any)=>{
        try {
            const {data}=await axios.post(`/api/auth/${state}`,credentials)
            if(data.success){
                console.log('Login successful, token:', data.token);
                setAuthUser(data.userData);
                connectSocket(data.userData)
                axios.defaults.headers.common["token"]=data.token;
                setToken(data.token)
                localStorage.setItem("token",data.token)
                toast.success(data.message)
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || error.message || String(error);
            console.error('Login error:', error?.response?.data);
            toast.error(message)
        }
    }


    const logout=()=>{
        localStorage.removeItem("token");
        setToken(null)
        setAuthUser(null)
        setOnlineUser([])
        axios.defaults.headers.common["token"]=null;
        toast.success("logged out successfully")
        if(socket) socket.disconnect();
    }
    const updateProfile=async (body: any)=>{
        try {
            const {data}=await axios.put("/api/auth/update-profile",body)
            if(data.success){
                setAuthUser(data.user)
                toast.success("Profile updated successfully")
            } else {
                toast.error(data.message || "Update failed")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message)
        }
    }


    const connectSocket=(userData:any)=>{
        if(!userData||socket?.connected) return ;
        const newSocket=io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",{
            query:{
                userId:userData._id,
            }
        })
        newSocket.connect();
        setSocket(newSocket)

        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUser(userIds)
        })
    }
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"]=token;
        }
        checkAuth()
    },[])
    const value={
        axios,
        token,
        authUser,
        onlineUser,
        socket,
        login,
        logout,
        updateProfile
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};