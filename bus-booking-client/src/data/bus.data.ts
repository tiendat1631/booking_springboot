import { cache } from "react";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Bus, PaginatedResponse, ApiResponse } from "@/types";
import type { GetBusesSchema } from "@/app/(admin)/buses/_lib/validations";

/**
 * Get all buses with filtering and sorting
 */
export const getBuses = cache(
    async (params: GetBusesSchema): Promise<PaginatedResponse<Bus>> => {
        const searchParams = new URLSearchParams();

        // Pagination (API is 0-indexed)
        searchParams.set("page", String(params.page - 1));
        searchParams.set("size", String(params.perPage));

        // Filters - only include if not empty
        if (params.licensePlate && params.licensePlate.length > 0) {
            searchParams.set("licensePlate", params.licensePlate);
        }
        if (params.type && params.type.length > 0) {
            searchParams.set("type", params.type);
        }
        if (params.status && params.status.length > 0) {
            searchParams.set("status", params.status);
        }

        // Sorting
        if (params.sort.length > 0) {
            const sortParam = `${params.sort[0].id},${params.sort[0].desc ? "desc" : "asc"}`;
            searchParams.set("sort", sortParam);
        }

        const query = searchParams.toString();
        const response = await apiGet<ApiResponse<PaginatedResponse<Bus>>>(
            `${API_ENDPOINTS.BUSES.BASE}?${query}`,
            {
                revalidate: 3600,
                tags: ["buses"],
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
 * Get bus by ID
 */
export const getBusById = cache(async (id: string): Promise<Bus | null> => {
    try {
        const response = await apiGet<ApiResponse<Bus>>(
            API_ENDPOINTS.BUSES.BY_ID(id),
            {
                revalidate: 3600,
                tags: ["buses", `bus-${id}`],
            }
        );
        return response.success ? response.data : null;
    } catch {
        return null;
    }
});

/**
 * Get available bus types
 */
export const getBusTypes = cache(async (): Promise<string[]> => {
    try {
        const response = await apiGet<ApiResponse<string[]>>(
            API_ENDPOINTS.BUSES.TYPES,
            {
                revalidate: 3600,
                tags: ["bus-types"],
            }
        );
        return response.success ? response.data : [];
    } catch {
        return [];
    }
});

/**
 * Get available bus statuses
 */
export const getBusStatuses = cache(async (): Promise<string[]> => {
    try {
        const response = await apiGet<ApiResponse<string[]>>(
            API_ENDPOINTS.BUSES.STATUSES,
            {
                revalidate: 3600,
                tags: ["bus-statuses"],
            }
        );
        return response.success ? response.data : [];
    } catch {
        return [];
    }
});
