import { Router } from 'express';

export function notificationRouter(redis) {
    const router = Router();

    router.post('/publish-notification', async (req, res) => {
       const payload = {
        title: req.body.title || 'Default Title',
        timestamp: new Date().toISOString(),
       }

       const receiver = await redis.publish('notifications', JSON.stringify(payload));
       res.json({ message: `Notification sent to ${receiver} receivers` });
    });

    return router;
}