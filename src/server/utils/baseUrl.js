/**
 * Resolves the canonical base URL for the application dynamically.
 * Prioritizes request origin and host headers so verification and reset links
 * always point to the actual domain (e.g., https://uncooked.in) rather than localhost.
 */
export function getBaseUrl(request) {
  if (request) {
    // 1. Incoming Request Origin header (e.g. "https://uncooked.in")
    const origin = request.headers?.get?.("origin");
    if (origin && origin.startsWith("http") && !origin.includes("localhost")) {
      return origin.replace(/\/$/, "");
    }

    // 2. Incoming Host & Forwarded Proto headers from live traffic
    const host = request.headers?.get?.("x-forwarded-host") || request.headers?.get?.("host");
    const proto = request.headers?.get?.("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
    if (host && !host.includes("localhost")) {
      return `${proto}://${host}`.replace(/\/$/, "");
    }
  }

  // 3. Environment Variable overrides
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes("localhost")) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, "");
  }

  // 4. If request is from localhost, use request host/origin
  if (request) {
    const origin = request.headers?.get?.("origin");
    if (origin && origin.startsWith("http")) return origin.replace(/\/$/, "");
    const host = request.headers?.get?.("host");
    if (host) return `http://${host}`.replace(/\/$/, "");
  }

  // 5. Fallback for production
  return "https://uncooked.in";
}
