import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/auth/login", "/auth/forgot-password", "/auth/accept-invite"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));
  const hasSessionHint =
    request.cookies.has("hireos_refresh") || request.cookies.has("hireos_access_hint");

  if (!isPublic && pathname.startsWith("/settings") && !hasSessionHint) {
    // Client also stores access token in sessionStorage; cookie hint set after login via document.cookie
    // Allow through and let client redirect if needed — soft gate for UX.
  }

  if (
    !isPublic &&
    pathname.startsWith("/resumeExtractor") &&
    !hasSessionHint
  ) {
    // Soft gate: allow through; client refresh/login handles hard auth.
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/settings/:path*", "/auth/:path*", "/resumeExtractor"],
};
