// Sliding Window Rate Limiter for Sensitive Endpoints
const rateLimitStore = new Map();

export function checkRateLimit(identifier, { limit = 20, windowMs = 60 * 1000 } = {}) {
  const now = Date.now();
  const userRecord = rateLimitStore.get(identifier) || [];

  // Filter out timestamps outside the sliding window
  const validRequests = userRecord.filter((timestamp) => now - timestamp < windowMs);

  if (validRequests.length >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetMs: windowMs - (now - validRequests[0]),
    };
  }

  validRequests.push(now);
  rateLimitStore.set(identifier, validRequests);

  // Periodic Cleanup
  if (rateLimitStore.size > 1000) {
    for (const [key, timestamps] of rateLimitStore.entries()) {
      if (timestamps.every((ts) => now - ts >= windowMs)) {
        rateLimitStore.delete(key);
      }
    }
  }

  return {
    success: true,
    limit,
    remaining: limit - validRequests.length,
    resetMs: windowMs,
  };
}
