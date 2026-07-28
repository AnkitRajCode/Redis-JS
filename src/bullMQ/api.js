import { Router } from "express";
import { emailQueue } from "./queue.js";

export function bullmqRouter(redis) {
  const router = Router();

  router.post("/welcome-email", async (req, res) => {

    const { email, name } = req.body || {};

    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    const job = await emailQueue.add("send-welcome-email", 
        { 
            to : email,
            name: name || "User"
        },
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000
            },
        }
    );
    res.json({ message: "Welcome email job added to the queue!", jobId: job.id });
  });

  return router;
}
