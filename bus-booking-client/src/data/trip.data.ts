import { cache } from "react";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Trip, TripDetails, SeatInfo, TripSearchParams, PaginatedResponse } from "@/types";

/**
 * Get all trips with pagination
 * Cached and revalidated every 60 seconds
 */
export const getTrips = cache(
    async (params?: { page?: number; size?: number }): Promise<PaginatedResponse<Trip>> => {
        const searchParams = new URLSearchParams();
        if (params?.page !== undefined) searchParams.set("page", String(params.page));
        if (params?.size !== undefined) searchParams.set("size", String(params.size));

        const query = searchParams.toString();
        return apiGet(`${API_ENDPOINTS.TRIPS.BASE}${query ? `?${query}` : ""}`, {
            revalidate: 60,
            tags: ["trips"],
        });
    }
);

/**
 * Get trip by ID
 * Cached with tag for on-demand revalidation
 */
export const getTripById = cache(async (id: string): Promise<TripDetails> => {
    return apiGet(API_ENDPOINTS.TRIPS.BY_ID(id), {
        revalidate: 60,
        tags: ["trips", `trip-${id}`],
    });
});

/**
 * Search trips with filters
 * Cached for 30 seconds (more dynamic data)
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
        return apiGet(`${API_ENDPOINTS.TRIPS.SEARCH}${query ? `?${query}` : ""}`, {
            revalidate: 30,
            tags: ["trips", "trip-search"],
        });
    }
);

/**
 * Get available seats for a trip
 * Cached for 10 seconds (seats change frequently)
 */
export const getTripSeats = cache(async (tripId: string): Promise<SeatInfo[]> => {
    return apiGet(API_ENDPOINTS.TRIPS.SEATS(tripId), {
        revalidate: 10,
        tags: [`trip-${tripId}`, `trip-${tripId}-seats`],
    });
});
