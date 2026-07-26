// user profile data can be stored in Redis in two different ways: as a JSON string or as a hash.
import { Router } from "express";

export function userRouter(redis) {
    const router = Router();

    router.post('/:id/json', async (req, res) => {
        const { id } = req.params.id;
        const userData = req.body;
        await redis.set(`user:${id}:json`, JSON.stringify(userData));
        res.json({ savedAs: 'json' });
    });

    router.get('/:id/json', async (req, res) => {
        const { id } = req.params.id;
        const userData = await redis.get(`user:${id}:json`);
        res.json({ user: userData ? JSON.parse(userData) : null });
    });

    router.post('/:id/hash', async (req, res) => {
        const { id } = req.params.id;
        const userData = req.body;
        await redis.hset(`user:${id}:hash`, userData);
        res.json({ savedAs: 'hash' });
    });

    router.get('/:id/hash', async (req, res) => {
        const { id } = req.params.id;
        const userData = await redis.hgetall(`user:${id}:hash`);
        res.json({ user: Object.keys(userData).length ? userData : null });
    });


    return router;
}