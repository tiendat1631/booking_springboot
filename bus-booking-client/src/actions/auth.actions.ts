"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import { API_ENDPOINTS, ROUTES } from "@/lib/constants";
import type { LoginInput, RegisterInput } from "@/lib/validators";
import type { ActionResult, ApiResponse } from "@/types";
import type { AuthTokenData, JwtPayload, Session } from "@/types/auth.types";

// ============================================================================
// Helper Functions
// ============================================================================

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
 * Save auth tokens to cookies and create session
 */
async function saveSession(tokenData: AuthTokenData): Promise<Session | null> {
    const { accessToken, refreshToken, expiresIn } = tokenData;

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

    // Set cookies
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    // Access token - httpOnly for security
    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: Math.floor(expiresIn / 1000),
        path: "/",
    });

    // Refresh token - httpOnly for security
    cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });

    // Session info - readable by client for UI
    cookieStore.set("session", JSON.stringify(session), {
        httpOnly: false,
        secure: isProduction,
        sameSite: "lax",
        maxAge: Math.floor(expiresIn / 1000),
        path: "/",
    });

    return session;
}

// ============================================================================
// Auth Actions
// ============================================================================

/**
 * Login user with email and password
 */
export async function login(
    data: LoginInput
): Promise<ActionResult<void>> {
    try {
        // Call login API
        const response = await apiPost<ApiResponse<AuthTokenData>>(
            API_ENDPOINTS.AUTH.LOGIN,
            data
        );

        // Check API response
        if (!response.success) {
            return {
                success: false,
                error: response.message || "Login failed",
            };
        }

        // Save session
        const session = await saveSession(response.data);
        if (!session) {
            return {
                success: false,
                error: "Invalid token received from server",
            };
        }

        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Login failed",
        };
    }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(): Promise<ActionResult<Session>> {
    try {
        const cookieStore = await cookies();
        const currentRefreshToken = cookieStore.get("refreshToken")?.value;

        if (!currentRefreshToken) {
            return {
                success: false,
                error: "No refresh token available",
            };
        }

        // Call refresh API
        const response = await apiPost<ApiResponse<AuthTokenData>>(
            API_ENDPOINTS.AUTH.REFRESH,
            { refreshToken: currentRefreshToken }
        );

        // Check API response
        if (!response.success) {
            // Clear cookies on refresh failure
            cookieStore.delete("accessToken");
            cookieStore.delete("refreshToken");
            cookieStore.delete("session");

            return {
                success: false,
                error: response.message || "Token refresh failed",
            };
        }

        // Save new session
        const session = await saveSession(response.data);
        if (!session) {
            return {
                success: false,
                error: "Invalid token received from server",
            };
        }

        return { success: true, data: session };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Token refresh failed",
        };
    }
}

/**
 * Register new user
 */
export async function register(
    data: RegisterInput
): Promise<ActionResult<void>> {
    try {
        await apiPost(API_ENDPOINTS.AUTH.REGISTER, data);

        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Registration failed",
        };
    }
}

/**
 * Logout user and clear cookies
 */
export async function logout(): Promise<void> {
    const cookieStore = await cookies();
    const refreshTokenValue = cookieStore.get("refreshToken")?.value;

    // Call logout API to invalidate tokens server-side
    if (refreshTokenValue) {
        try {
            await apiPost(API_ENDPOINTS.AUTH.LOGOUT, {
                refreshToken: refreshTokenValue,
            });
        } catch {
            // Ignore errors - still clear cookies
        }
    }

    // Clear all auth cookies
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("session");

    redirect(ROUTES.LOGIN);
}

/**
 * Verify email with token from email link
 */
export async function verifyEmail(token: string): Promise<ActionResult<void>> {
    try {
        await apiGet(API_ENDPOINTS.AUTH.VERIFY(token));
        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Email verification failed",
        };
    }
}

/**
 * Get current session from cookies (server-side)
 * Automatically refreshes expired tokens
 */
export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) return null;

    try {
        const session = JSON.parse(sessionCookie) as Session;

        // Check if session is expired (with 1 minute buffer)
        const bufferMs = 60 * 1000; // 1 minute
        if (session.expiresAt < Date.now() + bufferMs) {
            // Try to refresh token
            const refreshResult = await refreshToken();
            if (refreshResult.success) {
                return refreshResult.data;
            }
            return null;
        }

        return session;
    } catch {
        return null;
    }
}

/**
 * Check if user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session !== null;
}
