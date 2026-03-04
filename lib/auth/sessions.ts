import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET as string;
const COOKIE_NAME = "edu_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export interface JWTPayload {
    userId: string;
    roleId: string;
    roleName: string;
    email: string;
    fullName: string;
}

/**
 * Sign a JWT token with the given payload.
 */
export function signToken(payload: JWTPayload): string {
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify and decode a JWT token.
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

/**
 * Set the session cookie on a NextResponse.
 */
export function setSessionCookie(response: NextResponse, token: string): void {
    response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
    });
}

/**
 * Clear the session cookie on a NextResponse.
 */
export function clearSessionCookie(response: NextResponse): void {
    response.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });
}

/**
 * Get and verify the token from an incoming API request's cookie.
 * Works in Route Handlers.
 */
export function getTokenFromRequest(req: NextRequest): JWTPayload | null {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
}

/**
 * Get and verify token from server components using next/headers cookies().
 */
export async function getSessionFromCookies(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
}
