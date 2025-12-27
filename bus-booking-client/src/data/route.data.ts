import { cache } from "react";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Route, PaginatedResponse } from "@/types";

/**
 * Get all routes
 * Cached for 1 hour
 */
export const getRoutes = cache(
    async (params?: { page?: number; size?: number }): Promise<PaginatedResponse<Route>> => {
        const searchParams = new URLSearchParams();
        if (params?.page !== undefined) searchParams.set("page", String(params.page));
        if (params?.size !== undefined) searchParams.set("size", String(params.size));

        const query = searchParams.toString();
        return apiGet(`${API_ENDPOINTS.ROUTES.BASE}${query ? `?${query}` : ""}`, {
            revalidate: 3600,
            tags: ["routes"],
        });
    }
);

/**
 * Get route by ID
 * Cached for 1 hour
 */
export const getRouteById = cache(async (id: string): Promise<Route> => {
    return apiGet(API_ENDPOINTS.ROUTES.BY_ID(id), {
        revalidate: 3600,
        tags: ["routes", `route-${id}`],
    });
});
