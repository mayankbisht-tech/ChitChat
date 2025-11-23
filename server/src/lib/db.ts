import mongoose from "mongoose";

export const connectDB = async (mongoURL: string) => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    await mongoose.connect(`${process.env.MONGODB_URL}/chat-app`);
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};