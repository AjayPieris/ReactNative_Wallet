// backend/config/upstash.js
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import "dotenv/config";

function isValidHttpUrl(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

let ratelimit = null;
try {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (
    isValidHttpUrl(url) &&
    typeof token === "string" &&
    token.trim().length > 0
  ) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(100, "60 s"), // 100 requests per 60 seconds
    });
  }
} catch (error) {
  // If Upstash isn't configured correctly, disable rate limiting instead of crashing.
  ratelimit = null;
}

export default ratelimit;
