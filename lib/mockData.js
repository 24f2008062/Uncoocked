// Demo/sample events were intentionally removed. The app now shows only real
// events stored in the database, so there is no mock fallback. These exports
// are kept for call-site compatibility: `mockEvents` is empty, and
// `mergeWithMockEvents` is a no-op passthrough that still dedupes by id.

export const mockEvents = [];

// Merge DB events with the (now empty) mock fallback, deduping by id.
export function mergeWithMockEvents(dbEvents = []) {
  const byId = new Map();
  for (const event of dbEvents) {
    byId.set(event.id, event);
  }
  return Array.from(byId.values());
}
