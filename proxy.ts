import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./core/utils/session";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const session = await getSession();

  if (!session?.accessToken && !pathname.startsWith("/auth/login")) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
