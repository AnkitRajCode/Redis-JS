# BullMQ Job Queue (Producer + Worker)

Demonstrates a production-style background job queue using [BullMQ](https://docs.bullmq.io/) on top of Redis. Unlike the simple [Email Queue (Redis List)](email-queue.md) example, BullMQ adds automatic job processing, retries, backoff, and lifecycle events.

**Sources:**
- Queue definition: [../src/bullMQ/queue.js](../src/bullMQ/queue.js)
- Producer (HTTP router): [../src/bullMQ/api.js](../src/bullMQ/api.js)
- Consumer (worker): [../src/bullMQ/worker.js](../src/bullMQ/worker.js)

## Concept

BullMQ splits work into two roles:

| Role | File | Responsibility |
| --- | --- | --- |
| **Producer** | `api.js` | Adds jobs to the `emails` queue via an HTTP endpoint |
| **Worker** | `worker.js` | Continuously pulls jobs from the queue and processes them |

A shared Redis `connection` config is defined in `queue.js` and reused by both the queue and the worker. The worker consumes jobs **automatically** - no HTTP endpoint is needed to trigger processing.

## Endpoint

### `POST /bullmq/welcome-email`

Enqueue a welcome-email job.

- Body:

```json
{
	"email": "user@example.com",
	"name": "Alice"
}
```

- Response:

```json
{
	"message": "Welcome email job added to the queue!",
	"jobId": "1"
}
```

- Response (missing email):

```json
{
	"error": "email is required"
}
```

Jobs are added with retry options:

- `attempts: 3` - retry up to 3 times on failure
- `backoff: { type: "exponential", delay: 1000 }` - wait longer between each retry

## Running the Worker

The worker is a **separate process** from the web server. Start both:

```bash
# Terminal 1 - API (producer)
npm run dev

# Terminal 2 - worker (consumer)
npm run worker
```

> `npm run worker` runs `node src/bullMQ/worker.js`.

## Verifying Consumption

1. Start the API and worker (above).
2. Add a job:

```bash
curl --location --request POST 'localhost:3000/bullmq/welcome-email' \
	--header 'Content-Type: application/json' \
	--data '{"email":"user@example.com","name":"Alice"}'
```

3. Watch the **worker terminal** for the lifecycle logs:

```
Processing email job: 1 send-welcome-email { to: 'user@example.com', name: 'Alice' }
Email job completed: 1 send-welcome-email { ... }
Job 1 has completed! ...
```

## Worker Events

The worker listens to job lifecycle events for monitoring:

- `completed` - fired when a job finishes successfully
- `failed` - fired when a job throws (after all retry attempts are exhausted)

## Notes

- Requires `Content-Type: application/json`; in Express 5 `req.body` is `undefined` without it.
- The queue name (`emails`) must match between the producer (`Queue('emails')`) and the worker (`Worker('emails')`).
- BullMQ stores its data in Redis under `bull:emails:*` keys.
