// Lightweight in-memory rate limiter (per-IP). Suitable for a single-instance
// MVP. For multi-instance production, swap this Map for Redis/Upstash.
const buckets = new Map();

// Entry shape: { count: number, resetAt: number }
export function rateLimit(key, { limit = 10, windowMs = 60 * 1000 } = {}) {
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
