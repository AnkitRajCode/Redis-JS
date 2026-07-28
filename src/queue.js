import { Router } from 'express';

const  QUEUE_KEY = 'queue:emails';

export function queueRouter(redis){
    const router = Router();

    router.post('/', async (req, res) => {
        const job = {
            to: req.body.to,
            subject: req.body.subject || 'No Subject',
            body: req.body.body || 'No content',
            createdAt: new Date().toISOString()
        }
      await redis.lpush(QUEUE_KEY, JSON.stringify(job));
      res.json({ status: 'queued', job });
    });

    router.get('/process-one', async (req, res) => {
        const job = await redis.rpop(QUEUE_KEY);
        if (job) {
            const parsedJob = JSON.parse(job);
            res.json({ status: 'Email sent Successfully', job: parsedJob });
        } else {
            res.json({ message: 'No jobs in the queue' });
        }
    });

    return router;
}