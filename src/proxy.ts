import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  const pathname =
    req.nextUrl.pathname;

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register";

  const isProtectedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings");

  // Not logged in
  if (
    isProtectedRoute &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(
      new URL(
        "/login",
        req.nextUrl.origin
      )
    );
  }

  // Already logged in
  if (
    isAuthPage &&
    isLoggedIn
  ) {
    return NextResponse.redirect(
      new URL(
        "/",
        req.nextUrl.origin
      )
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};