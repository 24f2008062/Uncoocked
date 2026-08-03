export function sanitizeString(input, maxLength = 1000) {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, maxLength);
}

export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function parsePositiveInt(val, defaultValue = 1, max = 100) {
  const parsed = parseInt(val, 10);
  if (isNaN(parsed) || parsed < 1) return defaultValue;
  return Math.min(parsed, max);
}

export function validateHostApplicationInput(body) {
  const { organizationName, organizationType, organizationEmail, website } = body || {};

  const errors = [];
  if (!organizationName || typeof organizationName !== "string" || !organizationName.trim()) {
    errors.push("Organization Name is required");
  }
  if (!organizationType || typeof organizationType !== "string" || !organizationType.trim()) {
    errors.push("Organization Type is required");
  }
  if (organizationEmail && !isValidEmail(organizationEmail)) {
    errors.push("Invalid organization email format");
  }
  if (website && typeof website === "string" && website.trim() && !website.startsWith("http://") && !website.startsWith("https://")) {
    errors.push("Website URL must start with http:// or https://");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
