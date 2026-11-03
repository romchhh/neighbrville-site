import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_COOKIE } from "@/lib/admin/constants";
import { verifySignedSessionCookie } from "@/lib/admin/session-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isLoginApi = pathname === "/api/admin/login";
  const isLoginPage = pathname === "/admin";

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  // Login endpoints stay public (POST/GET handled in route; pages need to render).
  if (isLoginApi || isLoginPage) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const raw = request.cookies.get(ADMIN_COOKIE)?.value;
  const token = await verifySignedSessionCookie(raw);

  if (!token) {
    if (isAdminApi) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store",
            "X-Robots-Tag": "noindex, nofollow",
          },
        },
      );
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin";
    loginUrl.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(loginUrl);
    redirect.headers.set("X-Robots-Tag", "noindex, nofollow");
    redirect.headers.set("Cache-Control", "no-store");
    return redirect;
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Frame-Options", "DENY");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
