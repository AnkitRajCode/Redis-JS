# Redis JavaScript API

Small Express API demonstrating Redis-backed banner storage and MongoDB connectivity checks.

## Features

- Manage a banner message in Redis
- Generate and verify OTPs with Redis TTL
- Store and fetch user profiles as Redis JSON string or Redis hash
- Check Redis connectivity
- Check MongoDB connectivity using Mongoose
- Local development with Docker Compose (Redis + MongoDB)

## Tech Stack

- Node.js (ES modules)
- Express
- ioredis
- Mongoose
- Docker Compose (Redis + MongoDB)

## Project Structure

```
src/
	index.js      # app bootstrap and non-banner routes
	banner.js     # /banner router and handlers
	otp-ttl.js    # /otp router and handlers
	jsonVsHash.js # /user router for JSON vs Hash storage
	queue.js      # /emails-queue router (Redis list queue)
	bullMQ/       # BullMQ queue, producer router, and worker
		queue.js    # emails queue definition + Redis connection
		api.js      # /bullmq producer router
		worker.js   # background worker (job consumer)
docs/           # per-topic documentation
docker-compose.yml
package.json
```

## Documentation

Each topic has its own detailed guide with concepts, endpoints, and test commands:

- [Banner (Redis String)](docs/banner.md)
- [OTP with TTL (Redis Expiry)](docs/otp-ttl.md)
- [User Profile: JSON vs Hash](docs/json-vs-hash.md)
- [Email Queue (Redis List)](docs/email-queue.md)
- [BullMQ Job Queue (Producer + Worker)](docs/bullmq.md)
- [Health / Connectivity](docs/health-connectivity.md)

## Prerequisites

- Node.js 18+
- npm
- Docker Desktop (or Docker Engine + Compose)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start Redis and MongoDB:

```bash
docker compose up -d
```

3. Run the API:

```bash
npm run dev
```

This uses nodemon, so the server auto-restarts when files change.

For normal runtime (without auto-reload):

```bash
npm start
```

Server runs at `http://localhost:3000`.

## NPM Scripts

- `npm run dev`: development mode with nodemon
- `npm start`: run with Node.js (no file watching)
- `npm run worker`: start the BullMQ worker (job consumer) as a separate process

## Environment Variables

Optional environment variables:

- `REDIS_URL` (default: `redis://localhost:6379`)
- `MONGO_URI` (default: `mongodb://localhost:27017/JS_redis`)

Example:

```bash
REDIS_URL=redis://localhost:6379
MONGO_URI=mongodb://localhost:27017/JS_redis
```

## API Endpoints & Test Commands

See the per-topic guides in the [Documentation](#documentation) section above - each includes full endpoint references and `curl` test commands.

## Stop Local Services

```bash
docker compose down
```