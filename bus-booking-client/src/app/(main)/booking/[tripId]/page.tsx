import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTripById } from "@/queries";
import { BookingPageClient } from "./_components/booking-page-client";

export const metadata: Metadata = {
    title: "Đặt vé - BusGo",
    description: "Chọn ghế và điền thông tin để hoàn tất đặt vé",
};

interface BookingPageProps {
    params: Promise<{ tripId: string }>;
    searchParams: Promise<{ passengers?: string }>;
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
    const { tripId } = await params;
    const { passengers: passengersParam } = await searchParams;
    const passengers = passengersParam ? parseInt(passengersParam) : 1;

    const trip = await getTripById(tripId);

    if (!trip) {
        notFound();
    }

    return (
        <div className="container px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">Đặt vé xe</h1>
                    <p className="text-muted-foreground">
                        Chọn ghế và điền thông tin để hoàn tất đặt vé
                    </p>
                </div>

                <BookingPageClient trip={trip} passengers={passengers} />
            </div>
        </div>
    );
}
