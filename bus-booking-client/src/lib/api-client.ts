"use client";

import { refreshToken } from "@/actions/auth.action";

type FetchOptions = RequestInit & {
    skipAuthRefresh?: boolean;
};

// Track if a refresh is in progress to prevent race conditions
let refreshPromise: Promise<boolean> | null = null;

/**
 * Attempt to refresh the access token
 * Returns true if refresh was successful
 */
async function tryRefreshToken(): Promise<boolean> {
    // If a refresh is already in progress, wait for it
    if (refreshPromise) {
        return refreshPromise;
    }

    // Start a new refresh
    refreshPromise = (async () => {
        try {
            const result = await refreshToken();
            return result.success;
        } catch {
            return false;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

/**
 * Client-side fetch wrapper with automatic 401 handling
 * When a 401 is received, it will:
 * 1. Attempt to refresh the access token
 * 2. Retry the original request with the new token
 * 3. If refresh fails, redirect to login
 */
export async function apiClient<T>(
    url: string,
    options: FetchOptions = {}
): Promise<T> {
    const { skipAuthRefresh = false, ...fetchOptions } = options;

    const response = await fetch(url, {
        ...fetchOptions,
        credentials: "include", // Include cookies
    });

    // If 401 and we haven't skipped auth refresh
    if (response.status === 401 && !skipAuthRefresh) {
        const refreshed = await tryRefreshToken();

        if (refreshed) {
            // Retry the original request
            const retryResponse = await fetch(url, {
                ...fetchOptions,
                credentials: "include",
            });

            if (!retryResponse.ok) {
                throw new Error(`API Error: ${retryResponse.status}`);
            }

            const text = await retryResponse.text();
            return text ? JSON.parse(text) : ({} as T);
        } else {
            // Refresh failed - redirect to login
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
            throw new Error("Session expired");
        }
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({
            message: `HTTP Error: ${response.status}`,
        }));
        throw new Error(error.message || `API Error: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
}

/**
 * Shorthand methods for common HTTP methods
 */
export const clientApi = {
    get: <T>(url: string, options?: FetchOptions) =>
        apiClient<T>(url, { ...options, method: "GET" }),

    post: <T>(url: string, body?: unknown, options?: FetchOptions) =>
        apiClient<T>(url, {
            ...options,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        }),

    put: <T>(url: string, body?: unknown, options?: FetchOptions) =>
        apiClient<T>(url, {
            ...options,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        }),

    delete: <T>(url: string, options?: FetchOptions) =>
        apiClient<T>(url, { ...options, method: "DELETE" }),
};
