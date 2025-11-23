import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db';
import userRouter from './routes/userRoutes'
import messageRouter from './routes/messageRoutes';
const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: '4mb' }));
app.use(cors());

app.use('/api/status', (req, res) => {
  res.send({ status: 'Server is running' });
});
app.use("/api/auth",userRouter)
app.use("/api/messages",messageRouter);
async function startServer() {
  dotenv.config();

  await connectDB(process.env.MONGODB_URL || '');

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
