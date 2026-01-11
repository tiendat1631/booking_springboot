import { cache } from "react";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Booking } from "@/schemas/booking.schema";
import type { PaginatedResponse, ApiResponse } from "@/type";
import type { GetBookingsSchema } from "@/lib/validations/booking.validation";

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
            revalidate: 0,
            tags: ["my-bookings"],
        });
    }
);

/**
 * Get booking by ID
 */
export const getBookingById = cache(async (id: string): Promise<Booking> => {
    const response = await apiGet<ApiResponse<Booking>>(API_ENDPOINTS.BOOKINGS.BY_ID(id), {
        revalidate: 0,
        tags: ["my-bookings", `booking-${id}`],
    });
    if (!response.success || !response.data) {
        throw new Error("Booking not found");
    }
    return response.data;
});

/**
 * Get booking for payment page
 */
export const getBookingForPayment = cache(async (bookingId: string): Promise<Booking | null> => {
    try {
        const response = await apiGet<ApiResponse<Booking>>(
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
 * Admin: Get all bookings with search params
 */
export const getBookings = cache(
    async (input: GetBookingsSchema): Promise<PaginatedResponse<Booking>> => {
        const searchParams = new URLSearchParams();
        
        // Pagination (convert 1-indexed to 0-indexed)
        searchParams.set("page", String(input.page - 1));
        searchParams.set("size", String(input.perPage));

        // Filters
        if (input.bookingCode) searchParams.set("bookingCode", input.bookingCode);
        if (input.passengerName) searchParams.set("passengerName", input.passengerName);
        if (input.status) searchParams.set("status", input.status);
        if (input.paymentStatus) searchParams.set("paymentStatus", input.paymentStatus);

        // Sorting
        if (input.sort?.length) {
            const sortStr = input.sort
                .map(s => `${s.id},${s.desc ? "desc" : "asc"}`)
                .join(";");
            searchParams.set("sort", sortStr);
        }

        const query = searchParams.toString();

        const response = await apiGet<ApiResponse<any>>(`${API_ENDPOINTS.BOOKINGS.ADMIN}${query ? `?${query}` : ""}`, {
            revalidate: 30,
            tags: ["bookings"],
        });

        if (response.success && response.data) {
            return {
                content: response.data.content || [],
                page: {
                    size: response.data.size || input.perPage,
                    number: response.data.number || input.page - 1,
                    totalElements: response.data.totalElements || 0,
                    totalPages: response.data.totalPages || 0,
                },
            };
        }

        return {
            content: [],
            page: {
                size: input.perPage,
                number: input.page - 1,
                totalElements: 0,
                totalPages: 0,
            },
        };
    }
);

// Keep legacy function for backward compatibility
export const getAllBookings = getBookings;
