"use client";

import { useState, useEffect, useCallback } from "react";
import type { Session } from "@/type/auth.types";

/**
 * Parse session from cookie string
 */
function getSessionFromCookie(): Session | null {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split(";");
    const sessionCookie = cookies.find((c) => c.trim().startsWith("session="));

    if (!sessionCookie) return null;

    try {
        const value = sessionCookie.split("=").slice(1).join("=");
        return JSON.parse(decodeURIComponent(value)) as Session;
    } catch {
        return null;
    }
}

/**
 * Hook to access current session on client-side
 * Automatically updates when session cookie changes
 */
export function useSession() {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize session from cookie
    useEffect(() => {
        setSession(getSessionFromCookie());
        setIsLoading(false);
    }, []);

    // Listen for cookie changes (when login/logout happens)
    useEffect(() => {
        const handleStorageChange = () => {
            setSession(getSessionFromCookie());
        };

        // Check for session changes periodically (cookies don't have change events)
        const interval = setInterval(() => {
            const currentSession = getSessionFromCookie();
            setSession((prev) => {
                // Only update if session actually changed
                if (JSON.stringify(prev) !== JSON.stringify(currentSession)) {
                    return currentSession;
                }
                return prev;
            });
        }, 1000);

        // Also listen for visibility change (when user returns to tab)
        document.addEventListener("visibilitychange", handleStorageChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleStorageChange);
        };
    }, []);

    const refreshSession = useCallback(() => {
        setSession(getSessionFromCookie());
    }, []);

    return {
        session,
        isLoading,
        isAuthenticated: !!session,
        userId: session?.userId ?? null,
        email: session?.email ?? null,
        roles: session?.roles ?? null,
        refreshSession,
    };
}
