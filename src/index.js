import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import { createBannerRouter } from './banner.js';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use('/banner', createBannerRouter(redis));

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