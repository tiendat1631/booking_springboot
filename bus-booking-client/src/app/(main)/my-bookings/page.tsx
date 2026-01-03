import { Suspense } from "react";
import { MyBookingsClient } from "./_components/my-bookings-client";
import Loading from "./loading";
import type { BookingResponse, ApiResponse } from "@/types";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { cookies } from "next/headers";

// Hàm gọi API từ Server với authentication
async function getBookings(): Promise<BookingResponse[]> {
    try {
        // Debug: Check if user is authenticated
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;
        console.log("🔐 Access Token exists:", !!token);

        if (!token) {
            console.warn("⚠️ No access token found - user not logged in");
            return [];
        }

        // Gọi API với authentication token từ cookies
        console.log("📡 Fetching bookings from:", API_ENDPOINTS.BOOKINGS.MY_BOOKINGS);
        const response = await apiGet<ApiResponse<{ content: BookingResponse[] }>>(
            API_ENDPOINTS.BOOKINGS.MY_BOOKINGS,
            {
                cache: 'no-store', // Luôn fetch data mới
            }
        );

        console.log("📦 API Response:", JSON.stringify(response, null, 2));

        // Backend trả về format: { success: true, data: { content: [...] } }
        if (response.success && response.data?.content) {
            console.log("✅ Found bookings:", response.data.content.length);
            return response.data.content;
        }

        console.warn("⚠️ No bookings in response or unsuccessful");
        return [];
    } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        return []; // Trả về mảng rỗng nếu lỗi
    }
}

export default async function MyBookingsPage() {
    // Fetch bookings từ backend
    const bookings = await getBookings();
    console.log("🎯 Final bookings count:", bookings.length);

    return (
        <div className="container mx-auto px-4 py-8">
            <Suspense fallback={<Loading />}>
                <MyBookingsClient bookings={bookings} />
            </Suspense>
        </div>
    );
}