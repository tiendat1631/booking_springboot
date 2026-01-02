import { cache } from "react";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { PaginatedResponse, ApiResponse } from "@/type";

import { Route, RouteSummary } from "@/schemas/route.schema";
import { GetRoutesSchema } from "@/lib/validations/route.validation";

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
        if (params.departureProvince) searchParams.set("departureProvince", params.departureProvince);
        if (params.destinationProvince) searchParams.set("destinationProvince", params.destinationProvince);
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

        if (response.success) {
            return response.data;
        }

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
    const response = await apiGet<ApiResponse<Route>>(
        API_ENDPOINTS.ROUTES.BY_ID(id),
        {
            revalidate: 3600,
            tags: ["routes", `route-${id}`],
        }
    );
    return response.success ? response.data : null;
});

/**
 * Get active routes
 */
export const getActiveRoutes = cache(async (): Promise<RouteSummary[]> => {
        const response = await apiGet<ApiResponse<RouteSummary[]>>(
            API_ENDPOINTS.ROUTES.ACTIVE,
            {
                revalidate: 3600,
                tags: ["routes"],
            }
        );
        
        if (response.success) {
            return response.data;
        }

        return [];

});
