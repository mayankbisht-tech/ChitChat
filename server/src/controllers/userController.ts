import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User  from '../models/User';
import {generateToken}  from '../lib/utils'; 
import cloudinary from '../lib/cloudinary';
export const Signup = async (req: Request, res: Response) => {
    try {
        const { email, password, fullName, bio } = req.body as { email: string; password: string; fullName: string; bio: string };
        
        if(!email || !password || !fullName || !bio){ 
            return  res.status(400).json({ success: false, message: 'Email, password, full name and bio are required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser = new User({
            email,
            password: hashedPassword,
            fullName,
            bio
        });
        await newUser.save();
        const token=generateToken(newUser._id.toString());
        res.status(201).json({ 
            success: true,
            message: 'User created successfully', 
            token: token,
            userData: {
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                bio: newUser.bio,
                profilePic: newUser.profilePictureUrl
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}



export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email: string; password: string };    
        if(!email || !password){ 
            return  res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }   
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid email or password' });
        }   
        const token=generateToken(user._id.toString());
        res.status(200).json({ 
            success: true,
            message: 'Login successful', 
            token: token,
            userData: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                bio: user.bio,
                profilePic: user.profilePictureUrl
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }   
}


export const UpdateProfile = async (req: Request, res: Response) => {
    try {
        const {profilePic,bio,fullName}=req.body as {profilePic?:string,bio:string,fullName:string};
        const userId=(req as any).userId;
        let updatedUser:any;
        
        if(!profilePic){
            updatedUser=await User.findByIdAndUpdate(userId,{bio,fullName},{new:true});
        }else{
            const uploadResult = await cloudinary.uploader.upload(profilePic,{
                folder:'profile_pictures',
                width:150,
                height:150,
                crop:'fill'
            });
            updatedUser=await User.findByIdAndUpdate(userId,{
                profilePictureUrl:uploadResult.secure_url,
                bio,
                fullName
            },{new:true});
        }
        
        res.json({
            success:true,
            user: {
                _id: updatedUser._id,
                email: updatedUser.email,
                fullName: updatedUser.fullName,
                bio: updatedUser.bio,
                profilePic: updatedUser.profilePictureUrl
            }
        })
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }   
}