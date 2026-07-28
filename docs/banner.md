# Banner (Redis String)

Demonstrates a simple Redis string key-value pattern for app-wide state. Uses REST-style endpoints to set, read, delete, and check key existence.

**Source:** [../src/banner.js](../src/banner.js)

## Concept

A single Redis string key (`app:banner`) holds an app-wide message. This is the simplest Redis data model: one key, one value.

## Endpoints

### `POST /banner`

Set the banner message.

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

### `GET /banner`

Read the current banner message.

- Response:

```json
{
	"message": "Welcome to the app!"
}
```

### `DELETE /banner`

Delete the banner key.

- Response:

```json
{
	"status": true
}
```

### `GET /banner/exists`

Check whether the banner key exists (`1` = exists, `0` = missing).

- Response:

```json
{
	"exists": 1
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

## Redis Commands Used

- `SET` - store the message
- `GET` - read the message
- `DEL` - delete the key
- `EXISTS` - check key presence
