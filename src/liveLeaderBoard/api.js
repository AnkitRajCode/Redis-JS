// Live LeaderBoard router:
// Demonstrates atomic counters (INCR) and Redis Sorted Sets (ZINCRBY / ZREVRANGE / ZREVRANK).
// A sorted set gives us real-time ranking without SELECT -> UPDATE -> LOCK -> TRANSACTION.
import { Router } from 'express';

const LEADERBOARD_KEY = 'leaderboard';
const postViewsKey = (id) => `post:views:${id}`;

export function leaderboardRouter(redis) {
    const router = Router();

    // POST /:id/view -> increment view count of a post (INCR)
    router.post('/:id/view', async (req, res) => {
        const { id } = req.params;
        const views = await redis.incr(postViewsKey(id));
        res.json({ postId: id, views });
    });

    // POST /leaderboard/score -> add points to a user score (ZINCRBY)
    router.post('/leaderboard/score', async (req, res) => {
        const { userId, points } = req.body || {};

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const increment = Number(points ?? 1);
        if (Number.isNaN(increment)) {
            return res.status(400).json({ error: 'points must be a number' });
        }

        const score = await redis.zincrby(LEADERBOARD_KEY, increment, userId);
        res.json({ userId, score: Number(score) });
    });

    // GET /leaderboard -> get top 10 leaders (ZREVRANGE)
    router.get('/leaderboard', async (req, res) => {
        const raw = await redis.zrevrange(LEADERBOARD_KEY, 0, 9, 'WITHSCORES');

        const leaders = [];
        for (let i = 0; i < raw.length; i += 2) {
            leaders.push({
                rank: i / 2 + 1,
                userId: raw[i],
                score: Number(raw[i + 1]),
            });
        }

        res.json({ leaders });
    });

    // GET /leaderboard/:userId/rank -> get the rank of a user (ZREVRANK)
    router.get('/leaderboard/:userId/rank', async (req, res) => {
        const { userId } = req.params;
        const rank = await redis.zrevrank(LEADERBOARD_KEY, userId);

        if (rank === null) {
            return res.status(404).json({ error: 'user not found on leaderboard' });
        }

        const score = await redis.zscore(LEADERBOARD_KEY, userId);
        res.json({ userId, rank: rank + 1, score: Number(score) });
    });

    return router;
}
