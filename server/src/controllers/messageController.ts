import cloudinary from "../lib/cloudinary";
import Message from "../models/Message";
import User from "../models/User";

export const getUserForSidebar=async(req,res)=>{
    try {
        const userId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:userId}}).select("-password")
        const unseenMessages={};
        const promises=filteredUsers.map(async(user)=>{
            const messages=await Message.find({senderId:user._id,reciverId:userId,seen:false})
            if(Message.length>0){
                unseenMessages[user._id.toString()]=messages.length;
            }
        })
        await Promise.all(promises)
        res.json({success:true,users:filteredUsers,unseenMessages})
    } catch (error) {
        console.log(error.messgae);
        res.json({success:false,message:error.message})
    }
}

export const getMessages=async(req,res)=>{
    try {
        const{id:selectedUserId}=req.params;
        const myId=req.user._id;
        const messgaes=await Message.find({
            $or:[
                    {senderId:myId,reciverId:selectedUserId},
                    {senderId:selectedUserId,reciverId:myId}
                ]
        })
        await Message.updateMany({senderId:selectedUserId,reciverId:myId},{seen:true})
        res.json({success:true,messgaes})
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}




export const markMessageAsSeen=async(req,res)=>{
    try {
        const {id}=req.params;
        await Message.findByIdAndUpdate(id,{seen:true})
        res.json({success:true})
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}



export const sendMessage=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const reciverId=req.params.id;
        const senderId=req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=await Message.create({
            senderId,
            reciverId,
            text,image:imageUrl
        })
        res.json({success:true,newMessage}  )
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}