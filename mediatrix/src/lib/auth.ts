import "server-only";
import bcrypt from "bcryptjs";
import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getAuth, setAuth } from "./store";
import { SESSION_COOKIE, verifySession } from "./session";

export async function checkPassword(password: string): Promise<boolean> {
  const { passwordHash } = await getAuth();
  if (passwordHash) return bcrypt.compare(password, passwordHash);
  const initial = process.env.ADMIN_PASSWORD;
  if (!initial) return false;
  // constant-ish time compare for the bootstrap password
  const a = Buffer.from(password);
  const b = Buffer.from(initial);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function changePassword(newPassword: string) {
  await setAuth({ passwordHash: await bcrypt.hash(newPassword, 12) });
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value);
}

// Very small in-memory brute-force guard for the login endpoint.
const attempts = new Map<string, { n: number; until: number }>();
export function loginAllowed(ip: string): boolean {
  const a = attempts.get(ip);
  return !a || a.until < Date.now() || a.n < 5;
}
export function recordLogin(ip: string, ok: boolean) {
  if (ok) return attempts.delete(ip);
  const a = attempts.get(ip);
  const fresh = !a || a.until < Date.now();
  attempts.set(ip, { n: fresh ? 1 : a!.n + 1, until: Date.now() + 15 * 60 * 1000 });
}
