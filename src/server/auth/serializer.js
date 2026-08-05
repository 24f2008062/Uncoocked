// lib/auth/serializer.js

/**
 * Strips sensitive authentication secrets (passwordHash, login failure counters, lockout timestamps)
 * from a user object or array of user objects before returning them in API responses.
 *
 * @param {Object|Array|null} userOrUsers
 * @returns {Object|Array|null}
 */
export function sanitizeUser(userOrUsers) {
  if (!userOrUsers) return userOrUsers;
  if (Array.isArray(userOrUsers)) {
    return userOrUsers.map(u => sanitizeUser(u));
  }
  if (typeof userOrUsers !== "object") return userOrUsers;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, failedLoginAttempts, lockedUntil, ...safeUser } = userOrUsers;
  return safeUser;
}
