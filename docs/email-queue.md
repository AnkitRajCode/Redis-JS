# Email Queue (Redis List)

Demonstrates a simple job queue backed by a Redis list. Jobs are pushed to the head and processed from the tail, giving FIFO (first-in, first-out) ordering.

**Source:** [../src/queue.js](../src/queue.js)

## Concept

The list `queue:emails` acts as a queue:

- `LPUSH` adds new jobs to the left (head) of the list.
- `RPOP` removes jobs from the right (tail) of the list.

Combining left-push with right-pop yields FIFO processing order.

## Endpoints

### `POST /emails-queue`

Enqueue an email job.

- Body:

```json
{
	"to": "user@example.com",
	"subject": "Hello",
	"body": "Welcome to the app!"
}
```

- Response:

```json
{
	"status": "queued",
	"job": {
		"to": "user@example.com",
		"subject": "Hello",
		"body": "Welcome to the app!",
		"createdAt": "2026-07-28T00:00:00.000Z"
	}
}
```

`subject` defaults to `"No Subject"` and `body` defaults to `"No content"` when omitted.

### `GET /emails-queue/process-one`

Dequeue and process the next job (FIFO).

- Response (job available):

```json
{
	"status": "Email sent Successfully",
	"job": {
		"to": "user@example.com",
		"subject": "Hello",
		"body": "Welcome to the app!",
		"createdAt": "2026-07-28T00:00:00.000Z"
	}
}
```

- Response (queue empty):

```json
{
	"message": "No jobs in the queue"
}
```

## Quick Test Commands

Queue an email job:

```bash
curl -X POST http://localhost:3000/emails-queue \
	-H "Content-Type: application/json" \
	-d '{"to":"user@example.com","subject":"Hello","body":"Welcome!"}'
```

Process the next job:

```bash
curl http://localhost:3000/emails-queue/process-one
```

## Redis Commands Used

- `LPUSH` — add a job to the head of the list
- `RPOP` — remove a job from the tail of the list
