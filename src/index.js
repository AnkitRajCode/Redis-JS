import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import { createBannerRouter } from './banner.js';
import { OTPRouter } from './otp-ttl.js';
import { userRouter } from './jsonVsHash.js';
import { queueRouter } from './queue.js';
import { bullmqRouter } from './bullMQ/api.js';
import { notificationRouter } from './pub-sub/api.js';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use('/banner', createBannerRouter(redis));
app.use('/otp', OTPRouter(redis));
app.use('/user', userRouter(redis));
app.use('/emails-queue', queueRouter(redis));
app.use('/bullmq', bullmqRouter(redis));
app.use('/notifications', notificationRouter(redis));

app.get('/redis', async (req, res) => {
  const reply = await redis.ping();
  res.json({ redis: reply });
});

app.get('/mongo', async (req, res) => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/JS_redis';

  if(!mongoose.connection.readyState) {
    await mongoose.connect(mongoUri);
  }

  res.json({ mongo: "connected", database: mongoose.connection.db.databaseName });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});