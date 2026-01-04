"use server";

import { apiGet, apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { CreatePaymentInput, createPaymentSchema } from "@/lib/validations/payment.validation";
import { Payment } from "@/schemas/payment.schema";
import { ApiResponse } from "@/type";
import { revalidateTag, updateTag } from "next/cache";

export interface VNPayCallbackResult {
    success: boolean;
    message: string;
    rspCode: string;
}

export async function initiatePayment(input: CreatePaymentInput) {
    const validation = createPaymentSchema.safeParse(input);

    if (!validation.success) {
        return {
            success: false,
            error: "Invalid input",
        };
    }

    const { bookingId, method, returnUrl } = validation.data;

    try {
        const response = await apiPost<ApiResponse<Payment>>(
            API_ENDPOINTS.PAYMENT.INITIATE(bookingId),
            { method, returnUrl }
        );

        if (!response.success) {
            return {
                success: false,
                error: response.message,
            };
        }

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("Initiate payment error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        };
    }
}

export async function confirmCashPayment(bookingId: string) {
    try {
        const response = await apiPost<ApiResponse<Payment>>(
            API_ENDPOINTS.PAYMENT.CONFIRM_CASH(bookingId),
        );

        if (!response.success) {
            return {
                success: false,
                error: response.message,
            };
        }
        

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        };
    }
}

export async function processVNPayCallback(
    params: Record<string, string | undefined>
): Promise<VNPayCallbackResult> {
    try {
        // Build query string from params
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) queryParams.set(key, value);
        });

        // Call backend to verify and process payment
        const response = await apiGet<{ RspCode: string; Message: string }>(
            `${API_ENDPOINTS.PAYMENT.VNPAY_CALLBACK}?${queryParams.toString()}`,
            { revalidate: 0 }
        );

        if (response.RspCode === "00") {
            updateTag("bookings");
            updateTag("my-bookings");
        }

        return {
            success: response.RspCode === "00",
            message: response.Message || (response.RspCode === "00" ? "Payment successful" : "Payment failed"),
            rspCode: response.RspCode,
        };
    } catch (error) {
        console.error("Error processing VNPay callback:", error);
        return {
            success: false,
            message: "An error occurred while processing your payment",
            rspCode: "99",
        };
    }
}