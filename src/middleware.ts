import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  console.log(role,"role");
  console.log(token,"role");

  

  // Auth required
  if (
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/orders")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Admin only
  if (pathname.startsWith("/admin")) {
    if (!token || role?.toUpperCase() !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/orders/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
