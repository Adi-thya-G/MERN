// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRouter from './router/user.router.js';
import postRouter from './router/post.router.js';
import chatRouter from './router/message.router.js'
import followRouter from './router/followe.router.js'
const app = express();

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/follow',followRouter)

export default app;
