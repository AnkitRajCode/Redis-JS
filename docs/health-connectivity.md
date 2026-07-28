# Health / Connectivity

Simple health-check endpoints that verify connectivity to Redis and MongoDB.

**Source:** [../src/index.js](../src/index.js)

## Concept

- Redis connectivity is checked with a `PING` command, which returns `PONG`.
- MongoDB connectivity is verified by connecting through Mongoose (only if not already connected) and reporting the active database name.

## Endpoints

### `GET /redis`

Ping Redis.

- Response:

```json
{
	"redis": "PONG"
}
```

### `GET /mongo`

Confirm the MongoDB connection and report the database name.

- Response:

```json
{
	"mongo": "connected",
	"database": "JS_redis"
}
```

## Quick Test Commands

```bash
curl http://localhost:3000/redis
curl http://localhost:3000/mongo
```

## Environment Variables

- `REDIS_URL` (default: `redis://localhost:6379`)
- `MONGO_URI` (default: `mongodb://localhost:27017/JS_redis`)
