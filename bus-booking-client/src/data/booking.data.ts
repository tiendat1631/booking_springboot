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

        console.log("Fetching admin bookings with query:", query);

        // Backend returns ApiResponse<Page<BookingResponse>>
        const response = await apiGet<ApiResponse<any>>(`${API_ENDPOINTS.BOOKINGS.ADMIN}${query ? `?${query}` : ""}`, {
            revalidate: 30,
            tags: ["bookings"],
        });

        console.log("Raw API response:", response);

        // Transform Spring Page to PaginatedResponse
        if (response.success && response.data) {
            console.log("Response data:", response.data);

            // Transform BookingResponse[] to Booking[]
            const transformedContent = (response.data.content || []).map((item: any) => ({
                id: item.bookingId,
                bookingCode: item.bookingCode,
                tripId: item.trip?.tripId || "",
                customerId: "", // Not in BookingResponse
                customerName: item.passenger?.name || "",
                customerEmail: item.passenger?.email || "",
                customerPhone: item.passenger?.phone || "",
                seatNumbers: item.seats?.map((s: any) => s.seatId) || [],
                bookingStatus: item.status,
                paymentStatus: item.payment?.status || "PENDING",
                paymentMethod: item.payment?.method,
                totalPrice: item.finalAmount || 0,
                bookedAt: item.bookingTime,
                updatedAt: item.bookingTime,
            }));

            console.log("Transformed content:", transformedContent);

            return {
                content: transformedContent,
                page: {
                    size: response.data.size || params?.size || 10,
                    number: response.data.number || params?.page || 0,
                    totalElements: response.data.totalElements || 0,
                    totalPages: response.data.totalPages || 0,
                },
            };
        }

        console.warn("No data in response, returning empty");

        // Fallback empty response
        return {
            content: [],
            page: {
                size: params?.size || 10,
                number: params?.page || 0,
                totalElements: 0,
                totalPages: 0,
            },
        };
    }
);
