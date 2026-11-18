import "server-only";
import { cookies } from "next/headers";
import { getAuth, setAuth } from "./store";
import { SESSION_COOKIE, verifySession } from "./session";

// PBKDF2-SHA256 via Web Crypto: runs natively on Cloudflare Workers and Node.
// (100k iterations is the maximum Workers allows.)
const ITER = 100_000;
const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function derive(password: string, salt: Uint8Array<ArrayBuffer>, iter: number) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: iter }, key, 256));
}

function equal(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i];
  return d === 0;
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return ["pbkdf2", ITER, b64(salt), b64(await derive(password, salt, ITER))].join("$");
}

export async function checkPassword(password: string): Promise<boolean> {
  const { passwordHash } = await getAuth();
  if (passwordHash) {
    const [scheme, iter, salt, hash] = passwordHash.split("$");
    if (scheme !== "pbkdf2") return false;
    return equal(await derive(password, unb64(salt), Number(iter)), unb64(hash));
  }
  const initial = process.env.ADMIN_PASSWORD;
  if (!initial) return false;
  const enc = new TextEncoder();
  return equal(enc.encode(password), enc.encode(initial));
}

export async function changePassword(newPassword: string) {
  await setAuth({ passwordHash: await hashPassword(newPassword) });
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value);
}

// Small per-instance brute-force guard for the login endpoint.
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

export const clientIp = (req: Request) =>
  req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
