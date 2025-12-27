import { cache } from "react";
import { cookies } from "next/headers";
import { apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Session, ApiResponse } from "@/types";
import type { AuthTokenData, JwtPayload } from "@/types/auth.types";

/**
 * Decode JWT token to extract payload (without verification)
 */
function decodeJwt(token: string): JwtPayload | null {
    try {
        const base64Payload = token.split(".")[1];
        const payload = Buffer.from(base64Payload, "base64").toString("utf-8");
        return JSON.parse(payload) as JwtPayload;
    } catch {
        return null;
    }
}

/**
 * Refresh token and save new session
 * Returns null if refresh failed
 */
async function refreshAndSaveSession(): Promise<Session | null> {
    try {
        const cookieStore = await cookies();
        const currentRefreshToken = cookieStore.get("refreshToken")?.value;

        if (!currentRefreshToken) {
            return null;
        }

        // Call refresh API
        const response = await apiPost<ApiResponse<AuthTokenData>>(
            API_ENDPOINTS.AUTH.REFRESH,
            { refreshToken: currentRefreshToken }
        );

        if (!response.success) {
            // Clear cookies on refresh failure
            cookieStore.delete("accessToken");
            cookieStore.delete("refreshToken");
            cookieStore.delete("session");
            return null;
        }

        const { accessToken, refreshToken, expiresIn } = response.data;

        // Decode JWT to get user info
        const payload = decodeJwt(accessToken);
        if (!payload) {
            return null;
        }

        // Calculate expiry timestamp
        const expiresAt = Date.now() + expiresIn;

        // Create session object
        const session: Session = {
            userId: payload.userId,
            email: payload.sub,
            roles: payload.roles,
            accessToken,
            expiresAt,
        };

        const isProduction = process.env.NODE_ENV === "production";

        // Access token
        cookieStore.set("accessToken", accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            maxAge: Math.floor(expiresIn / 1000),
            path: "/",
        });

        // Refresh token
        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        // Session
        cookieStore.set("session", JSON.stringify(session), {
            httpOnly: false,
            secure: isProduction,
            sameSite: "lax",
            maxAge: Math.floor(expiresIn / 1000),
            path: "/",
        });

        return session;
    } catch {
        return null;
    }
}

/**
 * Get current session from cookies (server-side)
 * Cached per request to avoid redundant cookie parsing
 * Automatically refreshes expired tokens
 */
export const getSession = cache(async (): Promise<Session | null> => {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const session = JSON.parse(sessionCookie) as Session;

        // Check if session is expired (with 1 minute buffer for proactive refresh)
        const bufferMs = 60 * 1000;
        if (session.expiresAt < Date.now() + bufferMs) {
            // Try to refresh token
            return await refreshAndSaveSession();
        }

        return session;
    } catch {
        return null;
    }
});

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session !== null;
}

/**
 * Get current user ID from session
 */
export async function getCurrentUserId(): Promise<string | null> {
    const session = await getSession();
    return session?.userId ?? null;
}

/**
 * Get current user email from session
 */
export async function getCurrentUserEmail(): Promise<string | null> {
    const session = await getSession();
    return session?.email ?? null;
}

/**
 * Check if current user has specific role
 */
export async function hasRole(role: "CUSTOMER" | "ADMIN"): Promise<boolean> {
    const session = await getSession();
    if (!session?.roles) return false;
    return session.roles.includes(role);
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
    return hasRole("ADMIN");
}
