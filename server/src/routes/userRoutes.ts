import express from 'express'
import { Login, Signup, UpdateProfile } from '../controllers/userController'
import { checkAuth, protetectedRoute } from '../middleware/auth'
const userRouter=express.Router()

userRouter.post("/signup",Signup)
userRouter.post("/login",Login)
userRouter.put("/update-profile",protetectedRoute,UpdateProfile)
userRouter.get("/check",protetectedRoute,checkAuth)
export default userRouter

