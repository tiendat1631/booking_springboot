"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import { API_ENDPOINTS, ROUTES } from "@/lib/constants";
import { bookingSchema, cancelBookingSchema } from "@/lib/validators";
import type { ActionResult, ApiResponse } from "@/type";
import type { Booking } from "@/schemas/booking.schema";

/**
 * Create a new booking
 */
export async function createBooking(
    _prevState: ActionResult<Booking> | null,
    formData: FormData
): Promise<ActionResult<Booking>> {
    try {
        const rawData = {
            tripId: formData.get("tripId") as string,
            seatNumbers: formData.getAll("seatNumbers") as string[],
            customerName: formData.get("customerName") as string,
            customerEmail: formData.get("customerEmail") as string,
            customerPhone: formData.get("customerPhone") as string,
        };

        const validated = bookingSchema.safeParse(rawData);
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

        const booking = await apiPost<Booking>(
            API_ENDPOINTS.BOOKINGS.BASE,
            validated.data
        );

        // Revalidate related caches
        revalidateTag("my-bookings", "max");
        revalidateTag(`trip-${validated.data.tripId}-seats`, "max");

        return { success: true, data: booking };
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

/**
 * Create booking and redirect to confirmation
 */
export async function createBookingAndRedirect(
    _prevState: ActionResult<void> | null,
    formData: FormData
): Promise<ActionResult<void>> {
    const result = await createBooking(null, formData);

    if (result.success) {
        redirect(ROUTES.BOOKING_CONFIRMATION(result.data.bookingId));
    }

    return {
        success: false,
        error: result.error,
        fieldErrors: result.fieldErrors,
    };
}

