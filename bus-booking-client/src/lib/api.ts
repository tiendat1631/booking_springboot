import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
    method?: HttpMethod;
    body?: unknown;
    headers?: HeadersInit;
    cache?: RequestCache;
    revalidate?: number | false;
    tags?: string[];
}

class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public errorCode?: string
    ) {
        super(message);
        this.name = "ApiError";
    }
}

/**
 * Server-side API client for data fetching
 * Uses Next.js fetch with caching and revalidation
 */
export async function api<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const {
        method = "GET",
        body,
        headers = {},
        cache,
        revalidate,
        tags,
    } = options;

    // Get auth token from cookies (server-side only)
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const fetchOptions: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...headers,
        },
    };

    if (body) {
        fetchOptions.body = JSON.stringify(body);
    }

    if (cache) {
        fetchOptions.cache = cache;
    }

    // Next.js specific caching options
    if (revalidate !== undefined || tags) {
        fetchOptions.next = {};
        if (revalidate !== undefined) {
            fetchOptions.next.revalidate = revalidate;
        }
        if (tags) {
            fetchOptions.next.tags = tags;
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    if (!response.ok) {
        const error = await response.json().catch(() => ({
            message: `HTTP Error: ${response.status}`,
        }));
        throw new ApiError(
            error.message || `API Error: ${response.status}`,
            response.status,
            error.errorCode
        );
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) {
        return {} as T;
    }

    return JSON.parse(text);
}

// Shorthand methods
export const apiGet = <T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method">
) => api<T>(endpoint, { ...options, method: "GET" });

export const apiPost = <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
) => api<T>(endpoint, { ...options, method: "POST", body });

export const apiPut = <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
) => api<T>(endpoint, { ...options, method: "PUT", body });

export const apiPatch = <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
) => api<T>(endpoint, { ...options, method: "PATCH", body });

export const apiDelete = <T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method">
) => api<T>(endpoint, { ...options, method: "DELETE" });

export { ApiError };
