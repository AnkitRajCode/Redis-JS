import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const BANNER_KEY = "app:banner";

app.post('/banner', async (req, res) => {
  await redis.set(BANNER_KEY, req.body.message || 'Welcome to the app!');
  res.json({ status: true });
});

app.get('/banner', async (req, res) => {
  const message = await redis.get(BANNER_KEY);
  res.json({ message });
});

app.delete('/banner', async (req, res) => {
  await redis.del(BANNER_KEY);
  res.json({ status: true });
});

app.get('/banner/exists', async (req, res) => {
  const exists = await redis.exists(BANNER_KEY);
  res.json({ exists:exists });
});

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