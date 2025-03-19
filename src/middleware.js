import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/signup" || path === "/";

  const token = request.cookies.get("token")?.value;

  // ✅ Redirect unauthenticated users trying to access protected pages
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Redirect authenticated users away from public pages (avoid login/signup if already logged in)
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // ✅ Always return NextResponse.next() if no redirection is required
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/login",
    "/signup",
    "/courses",
    "/resume",
    "/jobs",
    "/interview/:path*",
    "/mentor",
  ],
};
