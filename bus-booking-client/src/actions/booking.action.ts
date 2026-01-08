"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { apiPost } from "@/lib/api";
import { API_ENDPOINTS, ROUTES } from "@/lib/constants";
import { cancelBookingSchema } from "@/lib/validators";
import { ApiResponse, isApiSuccess, type ActionResult } from "@/type";
import type { Booking } from "@/schemas/booking.schema";
import { createBookingSchema, CreateBookingInput } from "@/lib/validations";

/**
 * Create a new booking
 */
export async function createBooking(
    input: CreateBookingInput
): Promise<ActionResult<Booking>> {
    const parsed = createBookingSchema.safeParse(input);
    if (!parsed.success) {
        return {
            success: false,
            error: "Invalid input",
        };
    }
    try {
        const response = await apiPost<ApiResponse<Booking>>(
            API_ENDPOINTS.BOOKINGS.BASE,
            parsed.data
        );

        if (!isApiSuccess(response)) {
            return {
                success: false,
                error: response.message,
            };
        }

        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Đặt vé thất bại",
        };
    }
}

/**
 * Request cancellation OTP
 */
export async function requestCancellation(
    bookingId: string
): Promise<ActionResult<void>> {
    try {
        await apiPost(API_ENDPOINTS.BOOKINGS.REQUEST_CANCELLATION(bookingId), {});
        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Yêu cầu hủy vé thất bại",
        };
    }
}

/**
 * Confirm cancellation with OTP
 */
export async function confirmCancellation(
    _prevState: ActionResult<void> | null,
    formData: FormData
): Promise<ActionResult<void>> {
    try {
        const rawData = {
            bookingId: formData.get("bookingId") as string,
            otp: formData.get("otp") as string,
        };

        const validated = cancelBookingSchema.safeParse(rawData);
        if (!validated.success) {
            const fieldErrors: Record<string, string[]> = {};
            validated.error.issues.forEach((issue) => {
                const field = issue.path[0] as string;
                if (!fieldErrors[field]) fieldErrors[field] = [];
                fieldErrors[field].push(issue.message);
            });
            return {
                success: false,
                error: validated.error.issues[0]?.message || "Dữ liệu không hợp lệ",
                fieldErrors,
            };
        }

        await apiPost(API_ENDPOINTS.BOOKINGS.CANCEL(validated.data.bookingId), {
            otp: validated.data.otp,
        });

        // Revalidate caches
        revalidateTag("my-bookings", "max");
        revalidateTag(`booking-${validated.data.bookingId}`, "max");

        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Xác nhận hủy vé thất bại",
        };
    }
}

