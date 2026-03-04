import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/sessions";

const PROTECTED_PATHS = ["/dashboard"];
const AUTH_PATHS = ["/auth/login", "/auth/register"];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("edu_token")?.value ?? null;
    const session = token ? verifyToken(token) : null;

    // Protect dashboard routes
    const isDashboard = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
    if (isDashboard && !session) {
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect logged-in users away from auth pages
    const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));
    if (isAuthPage && session) {
        return NextResponse.redirect(new URL("/dashboard/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/auth/:path*"],
};
