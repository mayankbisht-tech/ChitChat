import jwt from "jsonwebtoken";
import User from "../models/User";

export const protetectedRoute = async (req: any, res: any, next: any) => {
    try {
        const token = req.headers.token;
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || '');
        req.userId = decoded.id;
        next();
        const user=await User.findById(decoded.userId).select('-password');
        if(!user){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user=user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}


export const checkAuth=(req:any,res:any,next:any)=>{
    res.json({success:true,message:"You are authorized",user:req.user});
}