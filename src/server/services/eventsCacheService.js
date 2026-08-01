// Centralized events in-memory cache helper
const cacheStore = new Map();
const EVENTS_CACHE_TTL_MS = 30_000; // 30 seconds

export function getCachedEvents(key) {
  const entry = cacheStore.get(key);
  if (entry && Date.now() - entry.at < EVENTS_CACHE_TTL_MS) {
    return entry.data;
  }
  return null;
}

export function setCachedEvents(key, data) {
  cacheStore.set(key, { at: Date.now(), data });
}

export function invalidateEventsCache() {
  cacheStore.clear();
}
