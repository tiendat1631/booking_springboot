import { cache } from "react";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { TripSummary, TripDetailResponse, TripSearchByProvinceParams, PaginatedResponse, ApiResponse } from "@/types";
import type { GetTripsSchema } from "@/app/(admin)/trips/_lib/validations";

/**
 * Get all trips with filtering and sorting (admin)

 */
export const getTrips = cache(
    async (params: GetTripsSchema): Promise<PaginatedResponse<TripSummary>> => {
        const searchParams = new URLSearchParams();

        // Pagination (API is 0-indexed)
        searchParams.set("page", String(params.page - 1));
        searchParams.set("size", String(params.perPage));
        
        if (params.status) {
            searchParams.set("status", params.status);
        }

        if (params.route) {
            searchParams.set("route", params.route);
        }

        // Date Filters
        if (params.fromDate) {
            searchParams.set("fromDate", params.fromDate);
        }
        if (params.toDate) {
            searchParams.set("toDate", params.toDate);
        }


        const query = searchParams.toString();
        console.log("Query: ", query);
        const response = await apiGet<ApiResponse<PaginatedResponse<TripSummary>>>(
            `${API_ENDPOINTS.TRIPS.BASE}?${query}`,
            {
                revalidate: 60,
                tags: ["trips"],
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
 * Get trip details for booking page
 */
export const getTripDetails = cache(async (tripId: string): Promise<TripDetailResponse | null> => {
    try {
        const response = await apiGet<ApiResponse<TripDetailResponse>>(
            API_ENDPOINTS.TRIPS.BY_ID(tripId),
            {
                revalidate: 30,
                tags: ["trips", `trip-${tripId}`],
            }
        );
        return response.success ? response.data : null;
    } catch {
        return null;
    }
});

/**
 * Get trip statuses
 */
export const getTripStatuses = cache(async (): Promise<string[]> => {
    try {
        const response = await apiGet<ApiResponse<string[]>>(
            API_ENDPOINTS.TRIPS.STATUSES,
            {
                revalidate: 3600,
                tags: ["trip-statuses"],
            }
        );
        return response.success ? response.data : [];
    } catch {
        return [];
    }
});

/**
 * Search trips by province (public)
 */
export const searchTripsByProvince = cache(
    async (params: TripSearchByProvinceParams): Promise<PaginatedResponse<TripSummary>> => {
        const searchParams = new URLSearchParams();
        searchParams.set("departureProvince", params.departureProvince);
        searchParams.set("arrivalProvince", params.arrivalProvince);
        searchParams.set("departureDate", params.departureDate);
        if (params.passengers) {
            searchParams.set("passengers", String(params.passengers));
        }
        if (params.page !== undefined) {
            searchParams.set("page", String(params.page));
        }
        if (params.size !== undefined) {
            searchParams.set("size", String(params.size));
        }

        const query = searchParams.toString();
        const response = await apiGet<ApiResponse<PaginatedResponse<TripSummary>>>(
            `${API_ENDPOINTS.TRIPS.SEARCH}?${query}`,
            {
                revalidate: 30,
                tags: ["trips", "trip-search"],
            }
        );

        if (response.success && response.data) {
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
