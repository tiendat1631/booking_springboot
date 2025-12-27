import { cache } from "react";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Station, PaginatedResponse } from "@/types";

/**
 * Get all stations
 * Cached for 1 hour (stations rarely change)
 */
export const getStations = cache(
    async (params?: { page?: number; size?: number }): Promise<PaginatedResponse<Station>> => {
        const searchParams = new URLSearchParams();
        if (params?.page !== undefined) searchParams.set("page", String(params.page));
        if (params?.size !== undefined) searchParams.set("size", String(params.size));

        const query = searchParams.toString();
        return apiGet(`${API_ENDPOINTS.STATIONS.BASE}${query ? `?${query}` : ""}`, {
            revalidate: 3600, // 1 hour
            tags: ["stations"],
        });
    }
);

/**
 * Get all active stations (for dropdowns)
 * Cached for 1 hour
 */
export const getActiveStations = cache(async (): Promise<Station[]> => {
    const response = await apiGet<PaginatedResponse<Station>>(API_ENDPOINTS.STATIONS.ACTIVE, {
        revalidate: 3600,
        tags: ["stations", "stations-active"],
    });
    return response.content;
});

/**
 * Get station by ID
 * Cached for 1 hour
 */
export const getStationById = cache(async (id: string): Promise<Station> => {
    return apiGet(API_ENDPOINTS.STATIONS.BY_ID(id), {
        revalidate: 3600,
        tags: ["stations", `station-${id}`],
    });
});

/**
 * Get stations by city
 * Cached for 1 hour
 */
export const getStationsByCity = cache(async (city: string): Promise<Station[]> => {
    const response = await apiGet<PaginatedResponse<Station>>(
        API_ENDPOINTS.STATIONS.BY_CITY(city),
        {
            revalidate: 3600,
            tags: ["stations", `stations-city-${city}`],
        }
    );
    return response.content;
});
