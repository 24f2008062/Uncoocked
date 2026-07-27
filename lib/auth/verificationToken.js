import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const VERIFICATION_SECRET =
  process.env.NEXTAUTH_SECRET || "uncooked-fallback-verification-secret-key";
const TOKEN_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generates a stateless, cryptographically secure, time-limited verification token.
 * Reuses the signed HMAC architecture established in the project.
 */
export function generateVerificationToken(user) {
  const timestamp = Date.now();
  const payload = `${user.email}|${timestamp}|${user.id}`;
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", VERIFICATION_SECRET)
    .update(payload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies a verification token. Checks HMAC signature, expiration time,
 * and whether the user is already verified.
 */
export async function verifyVerificationToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false, error: "Invalid verification token format." };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, error: "Invalid verification token format." };
  }

  const [encodedPayload, signature] = parts;
  let payload;
  try {
    payload = Buffer.from(encodedPayload, "base64url").toString("utf-8");
  } catch {
    return { valid: false, error: "Invalid verification token." };
  }

  const payloadParts = payload.split("|");
  if (payloadParts.length !== 3) {
    return { valid: false, error: "Invalid verification token structure." };
  }

  const [email, timestampStr, userId] = payloadParts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) {
    return { valid: false, error: "Invalid token timestamp." };
  }

  if (Date.now() - timestamp > TOKEN_EXPIRATION_MS) {
    return {
      valid: false,
      error: "This verification link has expired. Please request a new verification email.",
    };
  }

  const expectedSignature = crypto
    .createHmac("sha256", VERIFICATION_SECRET)
    .update(payload)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false, error: "Invalid verification token signature." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.id !== userId) {
    return { valid: false, error: "User associated with this token no longer exists." };
  }

  if (user.emailVerified) {
    return { valid: true, alreadyVerified: true, user, email };
  }

  return { valid: true, alreadyVerified: false, user, email };
}
