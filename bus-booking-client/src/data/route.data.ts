import { cache } from "react";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Route, PaginatedResponse, ApiResponse } from "@/types";
import type { GetRoutesSchema } from "@/app/(admin)/routes/_lib/validations";

/**
 * Get all routes with filtering and sorting
 */
export const getRoutes = cache(
    async (params: GetRoutesSchema): Promise<PaginatedResponse<Route>> => {
        const searchParams = new URLSearchParams();

        // Pagination (API is 0-indexed)
        searchParams.set("page", String(params.page - 1));
        searchParams.set("size", String(params.perPage));

        // Filters
        if (params.name) searchParams.set("name", params.name);
        if (params.code) searchParams.set("code", params.code);
        if (params.active !== null) searchParams.set("active", String(params.active));

        // Sorting
        if (params.sort.length > 0) {
            const sortParam = `${params.sort[0].id},${params.sort[0].desc ? "desc" : "asc"}`;
            searchParams.set("sort", sortParam);
        }

        const query = searchParams.toString();
        const response = await apiGet<ApiResponse<PaginatedResponse<Route>>>(
            `${API_ENDPOINTS.ROUTES.BASE}?${query}`,
            {
                revalidate: 3600,
                tags: ["routes"],
            }
        );

        // Handle ApiResponse wrapper
        if (response.success && response.data) {
            return response.data;
        }

        // Return empty paginated response on error
        return {
            content: [],
            page: {
                size: 10,
                number: 0,
                totalElements: 0,
                totalPages: 0,
            },
        };
    }
);

/**
 * Get route by ID
 */
export const getRouteById = cache(async (id: string): Promise<Route | null> => {
    try {
        const response = await apiGet<ApiResponse<Route>>(
            API_ENDPOINTS.ROUTES.BY_ID(id),
            {
                revalidate: 3600,
                tags: ["routes", `route-${id}`],
            }
        );
        return response.success ? response.data : null;
    } catch {
        return null;
    }
});
