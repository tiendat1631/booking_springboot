"use server";

import { apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { ApiResponse } from "@/type";

export interface CreateBookingActionInput {
    tripId: string;
    seatIds: string[];
    passengerName: string;
    passengerPhone: string;
    passengerEmail: string;
    notes?: string;
}

interface CreateBookingResponse {
    bookingId: string;
    bookingCode: string;
}

export interface CreateBookingActionResult {
    success: boolean;
    data?: CreateBookingResponse;
    error?: string;
}

export async function createBooking(input: CreateBookingActionInput): Promise<CreateBookingActionResult> {
    try {
        const response = await apiPost<ApiResponse<CreateBookingResponse>>(
            API_ENDPOINTS.BOOKINGS.BASE,
            {
                tripId: input.tripId,
                seatIds: input.seatIds,
                passengerName: input.passengerName,
                passengerPhone: input.passengerPhone,
                passengerEmail: input.passengerEmail,
                notes: input.notes,
            }
        );

        if (response.success && response.data) {
            return {
                success: true,
                data: response.data,
            };
        }

        return {
            success: false,
            error: response.message || "Failed to create booking",
        };
    } catch (error) {
        console.error("Create booking error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        };
    }
}
