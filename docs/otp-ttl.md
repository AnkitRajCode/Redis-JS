# OTP with TTL (Redis Expiry)

Shows short-lived authentication data using Redis TTL (time to live). Generates OTPs, verifies submitted codes, and exposes the remaining expiry time.

**Source:** [../src/otp-ttl.js](../src/otp-ttl.js)

## Concept

An OTP is stored under `otp:<phoneNumber>` with an expiry (`EX 30`, i.e. 30 seconds). Redis automatically deletes the key when the TTL elapses, so expired OTPs cannot be verified.

## Endpoints

### `POST /otp/generate`

Generate a 6-digit OTP that expires in 30 seconds.

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

### `POST /otp/verify`

Verify a submitted OTP against the stored value.

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

### `GET /otp/verify/:phone/ttl`

Return the remaining seconds before the OTP expires.

- Response:

```json
{
	"success": true,
	"ttl": 24
}
```

## Quick Test Commands

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

## Redis Commands Used

- `SET key value EX 30` - store OTP with a 30-second expiry
- `GET` - read the OTP for verification
- `TTL` - read remaining time to live
