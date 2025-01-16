import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = ["/login", "/signup", "/"].includes(path);

  // Redirect unauthenticated users from private routes
  if (!isPublicPath && !isValidToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users from public routes
  if (isPublicPath && isValidToken) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

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
  ],
};
