# User Profile: JSON vs Hash

Compares two Redis modeling strategies for profile data: storing the full object as a JSON string versus storing fields in a Redis hash. Useful for learning trade-offs between whole-object reads and field-based access.

**Source:** [../src/jsonVsHash.js](../src/jsonVsHash.js)

## Concept

| Strategy | Key | Trade-off |
| --- | --- | --- |
| JSON string | `user:<id>:json` | Simple whole-object read/write; must fetch and parse the entire object to read one field |
| Hash | `user:<id>:hash` | Field-level access and updates; values are stored as strings |

## Endpoints

### `POST /user/:id/json`

Store the full profile as a JSON string.

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

### `GET /user/:id/json`

Fetch and parse the JSON profile.

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

### `POST /user/:id/hash`

Store the profile as a Redis hash.

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

### `GET /user/:id/hash`

Fetch all hash fields (values are returned as strings).

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

## Quick Test Commands

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

## Redis Commands Used

- `SET` / `GET` — store and read the JSON string
- `HSET` — store hash fields
- `HGETALL` — read all hash fields
