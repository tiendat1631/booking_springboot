import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080/api";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ bookingId: string }> }
) {
    try {
        const { bookingId } = await params;

        // Get auth token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        console.log("=== Cash Payment Confirm Debug ===");
        console.log("Booking ID:", bookingId);
        console.log("Token exists:", !!token);
        console.log("All cookies:", cookieStore.getAll().map(c => c.name));

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Forward request to backend
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

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            return NextResponse.json(
                data || { error: "Failed to confirm payment" },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error confirming cash payment:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
