// lib/captcha.js

/**
 * Lightweight, zero-dependency Cloudflare Turnstile CAPTCHA verifier.
 * If TURNSTILE_SECRET_KEY is not set in environment variables (e.g., during local dev),
 * it returns true automatically so development workflows remain frictionless.
 *
 * @param {string|undefined} token - The captcha token from frontend form submission
 * @param {string|undefined} ip - The client IP address
 * @returns {Promise<boolean>}
 */
export async function verifyCaptcha(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Pass through if Turnstile is not configured for this environment

  if (!token) return false;

  try {
    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);
    if (ip && ip !== "unknown") {
      params.append("remoteip", ip);
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: params,
    });

    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return false;
  }
}
