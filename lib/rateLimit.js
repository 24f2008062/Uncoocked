// Rate limiter with dual backend support:
// - In-memory Map for single-instance development.
// - Redis (ioredis) for multi-instance production (optional).
//
// Set REDIS_URL in your environment to enable Redis-backed rate limiting.
// Example: REDIS_URL=redis://localhost:6379

let redisClient = null;

async function getRedis() {
  if (!redisClient && process.env.REDIS_URL) {
    try {
      const { Redis } = await import("ioredis");
      redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        enableOfflineQueue: false,
      });
    } catch {
      redisClient = null;
    }
  }
  return redisClient;
}

const buckets = new Map();

export async function rateLimit(key, { limit = 10, windowMs = 60 * 1000 } = {}) {
  const redis = await getRedis();
  if (redis) {
    const redisKey = `ratelimit:${key}`;
    const current = await redis.incr(redisKey);
    if (current === 1) {
      await redis.pexpire(redisKey, windowMs);
    }
    const ttl = await redis.pttl(redisKey);
    if (current > limit) {
      const retryAfter = Math.ceil(ttl / 1000);
      return { success: false, remaining: 0, retryAfter };
    }
    return { success: true, remaining: limit - current, retryAfter: 0 };
  }

  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { success: false, remaining: 0, retryAfter };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: limit - entry.count,
    retryAfter: 0,
  };
}

// Extract the client IP from a NextRequest (or route-handler Request).
export function getClientIp(request) {
  const fwd = request.headers?.get?.("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers?.get?.("x-real-ip") || "unknown";
}
