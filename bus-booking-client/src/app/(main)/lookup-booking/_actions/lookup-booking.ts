"use server";

import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { ApiResponse } from "@/type";

export interface BookingLookupResult {
    bookingId: string;
    bookingCode: string;
    status: string;
    trip: {
        tripId: string;
        routeName: string;
        departureStation: string;
        arrivalStation: string;
        departureTime: string;
        arrivalTime: string;
        busLicensePlate: string;
        busType: string;
    };
    passenger: {
        name: string;
        phone: string;
        email: string;
    };
    seats: Array<{
        seatId: string;
        price: number;
    }>;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    bookingTime: string;
    expiryTime: string;
    payment: {
        paymentId: string;
        method: string;
        status: string;
        amount: number;
        paidAt: string;
    } | null;
    notes: string | null;
}

export interface LookupActionResult {
    success: boolean;
    data?: BookingLookupResult;
    error?: string;
}

export async function lookupBooking(bookingCode: string): Promise<LookupActionResult> {
    try {
        if (!bookingCode || bookingCode.trim().length === 0) {
            return {
                success: false,
                error: "Vui lòng nhập mã booking",
            };
        }

        const response = await apiGet<ApiResponse<BookingLookupResult>>(
            API_ENDPOINTS.BOOKINGS.BY_CODE(bookingCode.trim().toUpperCase())
        );

        if (response.success && response.data) {
            return {
                success: true,
                data: response.data,
            };
        }

        return {
            success: false,
            error: response.message || "Không tìm thấy booking",
        };
    } catch (error) {
        console.error("Lookup booking error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Đã xảy ra lỗi",
        };
    }
}
