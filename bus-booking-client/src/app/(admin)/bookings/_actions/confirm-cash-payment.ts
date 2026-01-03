"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080/api";

export async function confirmCashPaymentAction(bookingId: string) {
    try {
        // Get auth token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        console.log("=== Confirm Cash Payment Server Action ===");
        console.log("Booking ID:", bookingId);
        console.log("Token exists:", !!token);

        if (!token) {
            return {
                success: false,
                error: "Unauthorized - Please login again",
            };
        }

        // Call backend API
        const response = await fetch(
            `${API_BASE_URL}/payments/cash/confirm/${bookingId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("Backend response status:", response.status);

        if (!response.ok) {
            const error = await response.text();
            console.error("Backend error:", error);
            return {
                success: false,
                error: error || "Failed to confirm payment",
            };
        }

        const data = await response.json();
        console.log("Success! Response:", data);

        // Revalidate the bookings page to refresh data
        revalidatePath("/admin/bookings");

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error("Error in confirmCashPaymentAction:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
