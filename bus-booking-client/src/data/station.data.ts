import { cache } from "react";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Station, PaginatedResponse, ApiResponse } from "@/types";
import type { GetStationsSchema } from "@/app/(admin)/stations/_lib/validations";

/**
 * Get all stations with filtering and sorting
 */
export const getStations = cache(
    async (params: GetStationsSchema): Promise<PaginatedResponse<Station>> => {
        const searchParams = new URLSearchParams();

        // Pagination (API is 0-indexed)
        searchParams.set("page", String(params.page - 1));
        searchParams.set("size", String(params.perPage));

        // Filters
        if (params.name) searchParams.set("name", params.name);
        if (params.province) searchParams.set("province", params.province);
        if (params.active !== null) searchParams.set("active", String(params.active));

        // Sorting
        if (params.sort.length > 0) {
            const sortParam = `${params.sort[0].id},${params.sort[0].desc ? "desc" : "asc"}`;
            searchParams.set("sort", sortParam);
        }

        const query = searchParams.toString();
        const response = await apiGet<ApiResponse<PaginatedResponse<Station>>>(
            `${API_ENDPOINTS.STATIONS.BASE}?${query}`,
            {
                revalidate: 3600,
                tags: ["stations"],
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
 * Get all active stations (for dropdowns)
 */
export const getActiveStations = cache(async (): Promise<Station[]> => {
    const response = await apiGet<ApiResponse<PaginatedResponse<Station>>>(
        `${API_ENDPOINTS.STATIONS.BASE}?active=true`,
        {
            revalidate: 3600,
            tags: ["stations", "stations-active"],
        }
    );
    return response.success && response.data ? response.data.content : [];
});

/**
 * Get station by ID
 */
export const getStationById = cache(async (id: string): Promise<Station> => {
    return apiGet(API_ENDPOINTS.STATIONS.BY_ID(id), {
        revalidate: 3600,
        tags: ["stations", `station-${id}`],
    });
});
