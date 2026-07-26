// User router concept:
// Compares two Redis modeling strategies for profile data:
// 1) store the full object as a JSON string, 2) store fields in a Redis hash.
// Useful for learning trade-offs between whole-object reads and field-based access.
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