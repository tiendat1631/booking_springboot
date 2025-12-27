import { cookies } from "next/headers";
import type { Session, User } from "@/types";

/**
 * Get current session from cookies (server-side)
 */
export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const userCookie = cookieStore.get("user")?.value;

    if (!accessToken || !userCookie) {
        return null;
    }

    try {
        const user = JSON.parse(userCookie) as User;
        const expiresAt = cookieStore.get("expiresAt")?.value;

        return {
            user,
            accessToken,
            expiresAt: expiresAt ? parseInt(expiresAt, 10) : Date.now() + 86400000,
        };
    } catch {
        return null;
    }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session !== null;
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<User | null> {
    const session = await getSession();
    return session?.user ?? null;
}

/**
 * Check if current user has specific role
 */
export async function hasRole(role: "CUSTOMER" | "ADMIN"): Promise<boolean> {
    const user = await getCurrentUser();
    return user?.role === role;
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
    return hasRole("ADMIN");
}
