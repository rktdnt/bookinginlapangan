import crypto from "crypto";

export const SESSION_COOKIE_NAME = "bookinglapangan_session";
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_ITERATIONS = 120000;
const TOKEN_BYTES = 32;
const TOKEN_TTL_DAYS = 7;

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function hashPassword(password, salt = crypto.randomBytes(PASSWORD_SALT_BYTES).toString("hex")) {
  const derived = crypto.pbkdf2Sync(String(password), salt, PASSWORD_ITERATIONS, 64, "sha512").toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const derived = crypto.pbkdf2Sync(String(password), salt, PASSWORD_ITERATIONS, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"));
}

export function createSessionToken() {
  return crypto.randomBytes(TOKEN_BYTES).toString("hex");
}

export function hashSessionToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getSessionExpiresAt() {
  return new Date(Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
}
