import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const dashboardToken = req.cookies.get("dashboard_session");

  if (!dashboardToken) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
