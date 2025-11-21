// backend/middleware/rateLimiter.js
import ratelimit from "../config/upstash.js";  // <-- include .js

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res.status(429).json({ error: 'Too many requests, please try again later.' });
    }

    next();
  } catch (error) {
    console.log("❌ Rate Limiter Error:", error);
    next(error);
  }
};

export default rateLimiter;
