import jwt from "jsonwebtoken";
import User from "../models/User";

export const protetectedRoute = async (req: any, res: any, next: any) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || '');
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized - User not found' });
        }
        req.user = user;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
}

export const checkAuth=(req:any,res:any)=>{
    const user = req.user;
    res.json({
        success:true,
        message:"You are authorized",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            bio: user.bio,
            profilePic: user.profilePictureUrl
        }
    });
}