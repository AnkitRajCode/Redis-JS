// Banner router concept:
// Demonstrates a simple Redis string key-value pattern for app-wide state.
// Uses REST-style endpoints to set, read, delete, and check key existence.
import { Router } from 'express';

const BANNER_KEY = 'app:banner';

export function createBannerRouter(redis) {
	const router = Router();

	router.post('/', async (req, res) => {
		await redis.set(BANNER_KEY, req.body.message || 'Welcome to the app!');
		res.json({ status: true });
	});

	router.get('/', async (req, res) => {
		const message = await redis.get(BANNER_KEY);
		res.json({ message });
	});

	router.delete('/', async (req, res) => {
		await redis.del(BANNER_KEY);
		res.json({ status: true });
	});

	router.get('/exists', async (req, res) => {
		const exists = await redis.exists(BANNER_KEY);
		res.json({ exists });
	});

	return router;
}


