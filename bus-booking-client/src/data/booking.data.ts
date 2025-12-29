import { cache } from "react";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Booking, BookingDetails, BookingResponse, PaginatedResponse, ApiResponse } from "@/types";

/**
 * Get current user's bookings
 */
export const getMyBookings = cache(
    async (params?: {
        page?: number;
        size?: number;
        status?: string;
    }): Promise<PaginatedResponse<Booking>> => {
        const searchParams = new URLSearchParams();
        if (params?.page !== undefined) searchParams.set("page", String(params.page));
        if (params?.size !== undefined) searchParams.set("size", String(params.size));
        if (params?.status) searchParams.set("status", params.status);

        const query = searchParams.toString();
        return apiGet(`${API_ENDPOINTS.BOOKINGS.MY_BOOKINGS}${query ? `?${query}` : ""}`, {
            revalidate: 0, // Always fresh
            tags: ["my-bookings"],
        });
    }
);

/**
 * Get booking by ID
 * No cache - sensitive data
 */
export const getBookingById = cache(async (id: string): Promise<BookingDetails> => {
    return apiGet(API_ENDPOINTS.BOOKINGS.BY_ID(id), {
        revalidate: 0,
        tags: ["my-bookings", `booking-${id}`],
    });
});

/**
 * Get booking for payment page
 */
export const getBookingForPayment = cache(async (bookingId: string): Promise<BookingResponse | null> => {
    try {
        const response = await apiGet<ApiResponse<BookingResponse>>(
            API_ENDPOINTS.BOOKINGS.BY_ID(bookingId),
            {
                revalidate: 0,
                tags: [`booking-${bookingId}`],
            }
        );
        return response.success ? response.data : null;
    } catch (error) {
        console.error("Failed to get booking:", error);
        return null;
    }
});

/**
 * Admin: Get all bookings
 * Cached for 30 seconds
 */
export const getAllBookings = cache(
    async (params?: {
        page?: number;
        size?: number;
        status?: string;
    }): Promise<PaginatedResponse<Booking>> => {
        const searchParams = new URLSearchParams();
        if (params?.page !== undefined) searchParams.set("page", String(params.page));
        if (params?.size !== undefined) searchParams.set("size", String(params.size));
        if (params?.status) searchParams.set("status", params.status);

        const query = searchParams.toString();
        return apiGet(`${API_ENDPOINTS.BOOKINGS.BASE}${query ? `?${query}` : ""}`, {
            revalidate: 30,
            tags: ["bookings"],
        });
    }
);
