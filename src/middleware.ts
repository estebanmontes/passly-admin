import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { getSessionCookie } from "better-auth/cookies";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const publicPaths = ["/signin"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Let Better Auth API routes pass through — no locale, no auth check
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 2. Check if this is a public path (strip locale prefix for comparison)
  const pathnameWithoutLocale = pathname.replace(/^\/(en|es)/, "") || "/";
  const isPublic = publicPaths.some((p) => pathnameWithoutLocale.startsWith(p));

  if (isPublic) {
    return intlMiddleware(request);
  }

  // 3. Protected routes — check for session cookie
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const locale = pathname.match(/^\/(en|es)/)?.[1] || routing.defaultLocale;
    const signinUrl = new URL(`/${locale}/signin`, request.url);
    return NextResponse.redirect(signinUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|es)/:path*", "/api/auth/:path*"],
};
