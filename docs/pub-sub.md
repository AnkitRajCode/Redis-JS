# Pub/Sub Notifications (Redis Publish/Subscribe)

Demonstrates Redis Publish/Subscribe (Pub/Sub) messaging. A publisher sends messages to a channel, and any number of subscribers listening on that channel receive them in real time.

**Sources:**
- Publisher (HTTP router): [../src/pub-sub/api.js](../src/pub-sub/api.js)
- Subscriber (listener): [../src/pub-sub/subscriber.js](../src/pub-sub/subscriber.js)

## Concept

| Role | File | Responsibility |
| --- | --- | --- |
| **Publisher** | `api.js` | Publishes a JSON message to the `notifications` channel via an HTTP endpoint |
| **Subscriber** | `subscriber.js` | Subscribes to the `notifications` channel and logs each received message |

Key points:

- Pub/Sub uses **separate Redis connections**. A client in subscribe mode cannot run other commands, so the subscriber has its own dedicated client.
- Pub/Sub is **fire-and-forget**: messages are delivered only to subscribers connected *at the time of publishing*. If no subscriber is listening, the message is lost (unlike a queue).
- `publish()` returns the number of subscribers that received the message.

## Endpoint

### `POST /notifications/publish-notification`

Publish a notification to the `notifications` channel.

- Body:

```json
{
	"title": "Hello"
}
```

`title` defaults to `"Default Title"` when omitted. A `timestamp` is added automatically.

- Response:

```json
{
	"message": "Notification sent to 1 receivers"
}
```

The receiver count is `0` when no subscriber is running.

## Running the Subscriber

The subscriber is a **separate process** from the web server. Start both:

```bash
# Terminal 1 — API (publisher)
npm run dev

# Terminal 2 — subscriber (listener)
npm run sub
```

> `npm run sub` runs `node src/pub-sub/subscriber.js`.

## Verifying Delivery

1. Start the API and subscriber (above).
2. Publish a notification:

```bash
curl -X POST http://localhost:3000/notifications/publish-notification \
	-H "Content-Type: application/json" \
	-d '{"title":"Hello"}'
```

3. Watch the **subscriber terminal**:

```
Received on notifications : { title: 'Hello', timestamp: '2026-07-29T00:00:00.000Z' }
```

The HTTP response reports how many subscribers received it (e.g. `Notification sent to 1 receivers`).

## Pub/Sub vs Queues

| | Pub/Sub | Queue (List / BullMQ) |
| --- | --- | --- |
| Delivery | All active subscribers | One consumer per job |
| Missed messages | Lost if no subscriber online | Persisted until processed |
| Use case | Real-time broadcast (notifications, events) | Reliable background work |

See [Email Queue (Redis List)](email-queue.md) and [BullMQ Job Queue](bullmq.md) for the queue-based patterns.
