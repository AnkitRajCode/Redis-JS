// OTP router concept:
// Shows short-lived authentication data using Redis TTL (time to live).
// Generates OTPs, verifies submitted codes, and exposes remaining expiry time.
import { Router } from "express";

export function OTPRouter(redis) {
    const router = Router();

    router.post("/generate", async (req, res) => {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ error: "Phone number is required" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await redis.set(`otp:${phoneNumber}`, otp, "EX", 30); // OTP expires in 30 seconds 
        res.json({ success: true, otp });
    });

    router.post("/verify", async (req, res) => {
        const { phoneNumber, otp } = req.body;
        if (!phoneNumber || !otp) {
            return res.status(400).json({ error: "Phone number and OTP are required" });
        }
        const storedOtp = await redis.get(`otp:${phoneNumber}`);
        if (storedOtp === otp) {
            return res.json({ success: true });
        } else {
            return res.status(400).json({ success: false, error: "Invalid OTP" });
        }
    });

    router.get("/verify/:phone/ttl", async (req, res) => {
        const { phone } = req.params;
        if (!phone) {
            return res.status(400).json({ error: "Phone number is required" });
        }
        const ttl = await redis.ttl(`otp:${phone}`);
        res.json({ success: true, ttl });
    });

    return router;
}