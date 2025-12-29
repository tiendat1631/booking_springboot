import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTripDetails } from "@/data";
import { TripSummaryCard } from "./_components/trip-summary-card";
import { BookingClient } from "./_components/booking-client";

export const metadata: Metadata = {
    title: "Book Your Trip - BusGo",
    description: "Choose your seats and complete your booking",
};

interface BookingPageProps {
    params: Promise<{ tripId: string }>;
    searchParams: Promise<{ passengers?: string }>;
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
    const { tripId } = await params;
    const { passengers: passengersParam } = await searchParams;
    const passengers = passengersParam ? parseInt(passengersParam) : 1;

    const trip = await getTripDetails(tripId);

    if (!trip) {
        notFound();
    }

    return (
        <div className="container px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">Book Your Trip</h1>
                    <p className="text-muted-foreground">
                        Select seats and fill in your details to complete booking
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left: Trip Info, Seat Selection & Passenger Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Trip Summary Card */}
                        <TripSummaryCard trip={trip} />

                        {/* Booking Form (Seat Selection + Passenger Info) */}
                        <BookingClient
                            tripId={trip.tripId}
                            seats={trip.seats}
                            seatLayout={trip.seatLayout}
                            maxSeats={passengers}
                            basePrice={trip.price}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
