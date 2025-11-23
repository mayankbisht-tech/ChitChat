import express from "express";
import { protetectedRoute } from "../middleware/auth";
import { getMessages, getUserForSidebar, markMessageAsSeen } from "../controllers/messageController";
const messageRouter=express.Router();
messageRouter.get("/users",protetectedRoute,getUserForSidebar)
messageRouter.get("/:id",protetectedRoute,getMessages)
messageRouter.put("mark/:id",protetectedRoute,markMessageAsSeen)


export default messageRouter;



