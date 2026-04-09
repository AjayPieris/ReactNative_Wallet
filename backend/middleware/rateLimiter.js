// backend/middleware/rateLimiter.js
import ratelimit from "../config/upstash.js"; // <-- include .js

const rateLimiter = async (req, res, next) => {
  // If Upstash isn't configured, don't block local development.
  if (!ratelimit) return next();

  try {
    // Use IP address or a unique identifier for the user
    const identifier = req.ip || "global-limit";
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return res
        .status(429)
        .json({ error: "Too many requests, please try again later." });
    }

    next();
  } catch (error) {
    console.log("❌ Rate Limiter Error:", error);
    // Fail-open so missing/misconfigured Upstash doesn't break the API.
    next();
  }
};

export default rateLimiter;
