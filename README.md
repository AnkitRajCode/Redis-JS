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
docker-compose.yml
package.json
```

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

## Environment Variables

Optional environment variables:

- `REDIS_URL` (default: `redis://localhost:6379`)
- `MONGO_URI` (default: `mongodb://localhost:27017/JS_redis`)

Example:

```bash
REDIS_URL=redis://localhost:6379
MONGO_URI=mongodb://localhost:27017/JS_redis
```

## API Endpoints

### Banner (Redis)

- `POST /banner`
	- Body:

```json
{
	"message": "Welcome to the app!"
}
```

	- Response:

```json
{
	"status": true
}
```

- `GET /banner`
	- Response:

```json
{
	"message": "Welcome to the app!"
}
```

- `DELETE /banner`
	- Response:

```json
{
	"status": true
}
```

- `GET /banner/exists`
	- Response:

```json
{
	"exists": 1
}
```

### OTP (Redis with TTL)

- `POST /otp/generate`
	- Body:

```json
{
	"phoneNumber": "9876543210"
}
```

	- Response:

```json
{
	"success": true,
	"otp": "123456"
}
```

- `POST /otp/verify`
	- Body:

```json
{
	"phoneNumber": "9876543210",
	"otp": "123456"
}
```

	- Response (success):

```json
{
	"success": true
}
```

	- Response (invalid):

```json
{
	"success": false,
	"error": "Invalid OTP"
}
```

- `GET /otp/verify/:phone/ttl`
	- Response:

```json
{
	"success": true,
	"ttl": 24
}
```

### User Profile (Redis JSON vs Hash)

- `POST /user/:id/json`
	- Body:

```json
{
	"name": "Alice",
	"email": "alice@example.com",
	"age": 25
}
```

	- Response:

```json
{
	"savedAs": "json"
}
```

- `GET /user/:id/json`
	- Response:

```json
{
	"user": {
		"name": "Alice",
		"email": "alice@example.com",
		"age": 25
	}
}
```

- `POST /user/:id/hash`
	- Body:

```json
{
	"name": "Alice",
	"email": "alice@example.com",
	"age": "25"
}
```

	- Response:

```json
{
	"savedAs": "hash"
}
```

- `GET /user/:id/hash`
	- Response:

```json
{
	"user": {
		"name": "Alice",
		"email": "alice@example.com",
		"age": "25"
	}
}
```

### Health/Connectivity

- `GET /redis`
	- Response:

```json
{
	"redis": "PONG"
}
```

- `GET /mongo`
	- Response:

```json
{
	"mongo": "connected",
	"database": "JS_redis"
}
```

## Quick Test Commands

Set banner:

```bash
curl -X POST http://localhost:3000/banner \
	-H "Content-Type: application/json" \
	-d '{"message":"Hello from Redis"}'
```

Get banner:

```bash
curl http://localhost:3000/banner
```

Check banner exists:

```bash
curl http://localhost:3000/banner/exists
```

Delete banner:

```bash
curl -X DELETE http://localhost:3000/banner
```

Generate OTP:

```bash
curl -X POST http://localhost:3000/otp/generate \
	-H "Content-Type: application/json" \
	-d '{"phoneNumber":"9876543210"}'
```

Verify OTP:

```bash
curl -X POST http://localhost:3000/otp/verify \
	-H "Content-Type: application/json" \
	-d '{"phoneNumber":"9876543210","otp":"123456"}'
```

Check OTP TTL:

```bash
curl http://localhost:3000/otp/verify/9876543210/ttl
```

Save user as JSON:

```bash
curl -X POST http://localhost:3000/user/101/json \
	-H "Content-Type: application/json" \
	-d '{"name":"Alice","email":"alice@example.com","age":25}'
```

Get user from JSON:

```bash
curl http://localhost:3000/user/101/json
```

Save user as Hash:

```bash
curl -X POST http://localhost:3000/user/101/hash \
	-H "Content-Type: application/json" \
	-d '{"name":"Alice","email":"alice@example.com","age":"25"}'
```

Get user from Hash:

```bash
curl http://localhost:3000/user/101/hash
```

Check services:

```bash
curl http://localhost:3000/redis
curl http://localhost:3000/mongo
```

## Stop Local Services

```bash
docker compose down
```

