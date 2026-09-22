import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const uid = request.cookies.get("session")?.value;
  const publicRoutes = ["/login", "/reset-password"];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // if (!isPublicRoute && !uid) {
  //   console.log(
  //     "No User Find , Resirecting to signin",
  //     request.nextUrl.pathname
  //   );
  //   const loginUrl = new URL("/login", request.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*", "/dashboard", "/editor"],
};
