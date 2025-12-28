import { cache } from "react";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Trip, TripSummary, TripDetails, SeatInfo, TripSearchParams, PaginatedResponse, ApiResponse } from "@/types";
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
 * Get trip by ID
 */
export const getTripById = cache(async (id: string): Promise<TripDetails | null> => {
    try {
        const response = await apiGet<ApiResponse<TripDetails>>(
            API_ENDPOINTS.TRIPS.BY_ID(id),
            {
                revalidate: 60,
                tags: ["trips", `trip-${id}`],
            }
        );
        return response.success ? response.data : null;
    } catch {
        return null;
    }
});

/**
 * Search trips with filters (public)
 */
export const searchTrips = cache(
    async (params: TripSearchParams): Promise<PaginatedResponse<Trip>> => {
        const searchParams = new URLSearchParams();
        if (params.departureStationId) {
            searchParams.set("departureStationId", params.departureStationId);
        }
        if (params.arrivalStationId) {
            searchParams.set("arrivalStationId", params.arrivalStationId);
        }
        if (params.departureDate) {
            searchParams.set("departureDate", params.departureDate);
        }
        if (params.page !== undefined) {
            searchParams.set("page", String(params.page));
        }
        if (params.size !== undefined) {
            searchParams.set("size", String(params.size));
        }

        const query = searchParams.toString();
        const response = await apiGet<ApiResponse<PaginatedResponse<Trip>>>(
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

/**
 * Get available seats for a trip
 */
export const getTripSeats = cache(async (tripId: string): Promise<SeatInfo[]> => {
    try {
        const response = await apiGet<ApiResponse<SeatInfo[]>>(
            API_ENDPOINTS.TRIPS.SEATS(tripId),
            {
                revalidate: 10,
                tags: [`trip-${tripId}`, `trip-${tripId}-seats`],
            }
        );
        return response.success ? response.data : [];
    } catch {
        return [];
    }
});

/**
 * Get available trip statuses
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
 * Search params for trip search by province
 */
export interface TripSearchByProvinceParams {
    departureProvince: string;
    arrivalProvince: string;
    departureDate: string;
    passengers?: number;
    page?: number;
    size?: number;
}

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
