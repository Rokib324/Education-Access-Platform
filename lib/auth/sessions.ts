import { SignJWT, jwtVerify } from "jose";
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

const JWT_SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

/**
 * Sign a JWT token with the given payload.
 */
export async function signToken(payload: JWTPayload): Promise<string> {
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
    const alg = 'HS256';
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg })
        .setExpirationTime('7d')
        .sign(JWT_SECRET_KEY);
}

/**
 * Verify and decode a JWT token.
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
        const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
        return payload as unknown as JWTPayload;
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
export async function getTokenFromRequest(req: NextRequest): Promise<JWTPayload | null> {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
}

/**
 * Get and verify token from server components using next/headers cookies().
 */
export async function getSessionFromCookies(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
}
