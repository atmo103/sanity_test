import "server-only";
import { createHmac, createHash, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE = "dida_panel";
export const SESSION_SECONDS = 60 * 60 * 8;

export function authConfigured() {
  return (process.env.PANEL_PASSWORD?.length || 0) >= 11 && (process.env.PANEL_SESSION_SECRET?.length || 0) >= 32;
}
function signature(payload) {
  return createHmac("sha256", process.env.PANEL_SESSION_SECRET)
    .update(`${payload}:${process.env.PANEL_PASSWORD}`).digest("base64url");
}
export function passwordMatches(password) {
  if (!authConfigured() || typeof password !== "string" || password.length > 256) return false;
  const hash = (s) => createHash("sha256").update(s).digest();
  return timingSafeEqual(hash(password), hash(process.env.PANEL_PASSWORD));
}
export function createSession() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_SECONDS * 1000, nonce: randomBytes(18).toString("hex") })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}
export function validSession(value) {
  if (!authConfigured() || typeof value !== "string" || value.length > 1024) return false;
  try {
    const [payload, supplied, extra] = value.split(".");
    if (!payload || !supplied || extra) return false;
    const expected = signature(payload);
    if (supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return false;
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return Number.isFinite(exp) && exp > Date.now() && exp <= Date.now() + SESSION_SECONDS * 1000;
  } catch { return false; }
}
export async function hasSession() {
  return validSession((await cookies()).get(COOKIE)?.value);
}
