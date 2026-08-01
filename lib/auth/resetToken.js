import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const RESET_SECRET = process.env.NEXTAUTH_SECRET || "uncooked-fallback-reset-secret-key";
const TOKEN_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

/**
 * Generates a stateless, cryptographically secure, time-limited reset token.
 * Includes a prefix of the user's current passwordHash in the HMAC payload,
 * ensuring the token is automatically invalidated once the password is reset.
 */
export function generateResetToken(user) {
  const timestamp = Date.now();
  const hashPrefix = (user.passwordHash || "").slice(0, 16);
  const payload = `${user.email}|${timestamp}|${hashPrefix}`;
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", RESET_SECRET)
    .update(payload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies a reset token. Checks HMAC signature, expiration time,
 * and ensures the user's password has not already been changed.
 */
export async function verifyResetToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false, error: "Invalid reset token format." };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, error: "Invalid reset token format." };
  }

  const [encodedPayload, signature] = parts;
  let payload;
  try {
    payload = Buffer.from(encodedPayload, "base64url").toString("utf-8");
  } catch {
    return { valid: false, error: "Invalid reset token." };
  }

  const payloadParts = payload.split("|");
  if (payloadParts.length !== 3) {
    return { valid: false, error: "Invalid reset token structure." };
  }

  const [email, timestampStr, hashPrefix] = payloadParts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) {
    return { valid: false, error: "Invalid token timestamp." };
  }

  if (Date.now() - timestamp > TOKEN_EXPIRATION_MS) {
    return {
      valid: false,
      error: "This password reset link has expired. Please request a new one.",
    };
  }

  const expectedSignature = crypto
    .createHmac("sha256", RESET_SECRET)
    .update(payload)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false, error: "Invalid reset token signature." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { valid: false, error: "User associated with this token no longer exists." };
  }

  if ((user.passwordHash || "").slice(0, 16) !== hashPrefix) {
    return {
      valid: false,
      error: "This password reset link has already been used or is invalid.",
    };
  }

  return { valid: true, user, email };
}
