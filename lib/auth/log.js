// Minimal structured auth event logging.
// NEVER log passwords, JWTs, session tokens, secrets, or password hashes.

export function logAuthEvent(event, meta = {}) {
  const safe = {};
  for (const [k, v] of Object.entries(meta)) {
    if (["password", "hash", "token", "secret", "jwt"].includes(k)) continue;
    safe[k] = v;
  }
  const ts = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.info(`[AUTH] ${ts} ${event}`, safe);
}
