import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/signup" || path === "/";

  const token = request.cookies.get("token")?.value || "";

  // Redirect unauthenticated users to login (change this to /login)
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }
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
