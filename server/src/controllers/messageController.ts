import cloudinary from "../lib/cloudinary";
import Message from "../models/Message";
import User from "../models/User";
import {io,userSocketMap} from "../server"
export const getUserForSidebar=async(req: any, res: any)=>{
    try {
        const userId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:userId}}).select("-password")
        const unseenMessages: Record<string, number> = {};
        const promises=filteredUsers.map(async(user)=>{
            const messages=await Message.find({senderId:user._id,receiverId:userId,seen:false})
            if(messages.length > 0){
                unseenMessages[user._id.toString()]=messages.length;
            }
        })
        await Promise.all(promises)
        
        const usersForClient = filteredUsers.map(user => ({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            bio: user.bio,
            profilePic: user.profilePictureUrl
        }));
        
        res.json({success:true,users:usersForClient,unseenMessages})
    } catch (error: any) {
        console.log('getUserForSidebar error:', error.message);
        res.status(500).json({success:false,message:error.message})
    }
}

export const getMessages=async(req: any, res: any)=>{
    try {
        const{id:selectedUserId}=req.params;
        const myId=req.user._id;
        const messages=await Message.find({
            $or:[
                    {senderId:myId,receiverId:selectedUserId},
                    {senderId:selectedUserId,receiverId:myId}
                ]
        })
        await Message.updateMany({senderId:selectedUserId,receiverId:myId},{seen:true})
        res.json({success:true,messages})
    } catch (error: any) {
        console.log('getMessages error:', error.message)
        res.status(500).json({success:false,message:error.message})
    }
}




export const markMessageAsSeen=async(req: any, res: any)=>{
    try {
        const {id}=req.params;
        await Message.findByIdAndUpdate(id,{seen:true})
        res.json({success:true})
    } catch (error: any) {
        console.log('markMessageAsSeen error:', error.message)
        res.status(500).json({success:false,message:error.message})
    }
}



export const sendMessage=async(req: any, res: any)=>{
    try {
        const {text,image}=req.body;
        const receiverId=req.params.id;
        const senderId=req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        const receiverSocketId=userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        res.json({success:true,newMessage})
    } catch (error: any) {
        console.log('sendMessage error:', error.message)
        res.status(500).json({success:false,message:error.message})
    }
}