import { cache } from "react";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { GetTripsSchema } from "@/lib/validations";
import type { PaginatedResponse, ApiResponse } from "@/type";
import { Trip } from "@/schemas";

/**
 * Get all trips with filtering and sorting (admin)
 */
export const getTrips = cache(
    async (params: GetTripsSchema): Promise<PaginatedResponse<Trip>> => {
        const searchParams = new URLSearchParams();

        // Pagination (API is 0-indexed)
        searchParams.set("page", String(params.page - 1));
        searchParams.set("size", String(params.perPage));
        
        // Filters
        if (params.status) searchParams.set("status", params.status);
        if (params.routeCode) searchParams.set("routeCode", params.routeCode);
        if (params.busLicensePlate) searchParams.set("busLicensePlate", params.busLicensePlate);
        if (params.departureStationName) searchParams.set("departureStationName", params.departureStationName);
        if (params.arrivalStationName) searchParams.set("arrivalStationName", params.arrivalStationName);
        if (params.busType) searchParams.set("busType", params.busType);

        
        // Parse departureTime dateRange (format: "2025-12-24,2025-12-25") into fromDate and toDate
        if (params.departureTime) {
            const [fromDate, toDate] = params.departureTime.split(",");
            if (fromDate) searchParams.set("fromDate", fromDate);
            if (toDate) searchParams.set("toDate", toDate);
        }

        // Sorting
        if (params.sort.length > 0) {
            const sortParam = `${params.sort[0].id},${params.sort[0].desc ? "desc" : "asc"}`;
            searchParams.set("sort", sortParam);
        }

        const query = searchParams.toString();
        const response = await apiGet<ApiResponse<PaginatedResponse<Trip>>>(
            `${API_ENDPOINTS.TRIPS.BASE}?${query}`,
            {
                revalidate: 3600,
                tags: ["trips"],
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
 * Get trip by ID
 */
export const getTripById = cache(async (tripId: string): Promise<Trip | null> => {
    try {
        const response = await apiGet<ApiResponse<Trip>>(
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

export interface TripSearchParams {
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
    async (params: TripSearchParams): Promise<PaginatedResponse<Trip>> => {
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
        const response = await apiGet<ApiResponse<PaginatedResponse<Trip>>>(
            `${API_ENDPOINTS.TRIPS.SEARCH}?${query}`,
            {
                revalidate: 30,
                tags: ["trips", "trip-search"],
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
