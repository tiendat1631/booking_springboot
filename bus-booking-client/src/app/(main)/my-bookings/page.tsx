import { Suspense } from "react";
import { MyBookingsClient } from "./_components/my-bookings-client";
import Loading from "./loading";
import type { Booking } from "@/schemas/booking.schema";
import type { ApiResponse } from "@/type";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { cookies } from "next/headers";

// Force dynamic rendering because we use cookies
export const dynamic = 'force-dynamic';

// Hàm gọi API từ Server với authentication
async function getBookings(): Promise<Booking[]> {
    "use server";
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        if (!token) {
            console.warn("No access token found - user not logged in");
            return [];
        }

        const response = await apiGet<ApiResponse<{ content: Booking[] }>>(
            API_ENDPOINTS.BOOKINGS.MY_BOOKINGS,
            {
                cache: 'no-store',
            }
        );

        if (response.success && response.data?.content) {
            return response.data.content;
        }

        return [];
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }
}

export default async function MyBookingsPage() {
    const bookings = await getBookings();

    return (
        <div className="container pt-16 mx-auto px-4 py-8">
            <Suspense fallback={<Loading />}>
                <MyBookingsClient bookings={bookings} />
            </Suspense>
        </div>
    );
}