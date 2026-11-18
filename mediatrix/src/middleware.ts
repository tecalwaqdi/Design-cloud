import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "./lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    const pref = req.headers.get("accept-language") || "";
    const lang = /^\s*en/i.test(pref) && !/ar/i.test(pref.split(",")[0]) ? "en" : "ar";
    return NextResponse.redirect(new URL(`/${lang}`, req.url));
  }

  const isAdminArea =
    (pathname.startsWith("/admin") && pathname !== "/admin/login") ||
    (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login");
  if (isAdminArea) {
    const ok = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    if (!ok) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/", "/admin/:path*", "/api/admin/:path*"] };
