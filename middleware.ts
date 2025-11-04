import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const adminPaths = [
    "/admin",
    "/announcements/new",
    "/schedules/new",
    "/events/new",
  ];
  const authRequiredPaths = ["/complaints/new"];

  // Admin routes
  if (adminPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = `callbackUrl=${encodeURIComponent(
        pathname + (search || "")
      )}`;
      return NextResponse.redirect(url);
    }
    if (token.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // Auth-only routes
  if (authRequiredPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = `callbackUrl=${encodeURIComponent(
        pathname + (search || "")
      )}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/announcements/new",
    "/schedules/new",
    "/events/new",
    "/complaints/new",
  ],
};
