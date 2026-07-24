import Express from 'express';
import Redis from 'ioredis';

const app = Express();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');


