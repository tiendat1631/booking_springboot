"use client";

import { useState, useCallback } from "react";
import { SeatBookingForm  } from "./seat-booking-form";
import { BookingSummary } from "./booking-summary";
import type { TripDetail } from "@/schemas";

interface BookingPageClientProps {
    trip: TripDetail;
    passengers: number;
}

export function BookingPageClient({ trip, passengers }: BookingPageClientProps) {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const handleSeatChange = useCallback((seats: string[], price: number) => {
        setSelectedSeats(seats);
        setTotalPrice(price);
    }, []);

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Seat Selection & Passenger Form */}
            <div className="lg:col-span-2 space-y-6">
                <SeatBookingForm 
                    tripId={trip.tripId}
                    seats={trip.seats}
                    seatLayout={trip.seatLayout}
                    maxSeats={passengers}
                    basePrice={trip.price}
                    onSeatChange={handleSeatChange}
                />
            </div>

            {/* Right: Booking Summary Sidebar */}
            <div className="lg:col-span-1">
                <BookingSummary 
                    trip={trip} 
                    passengers={passengers}
                    selectedSeats={selectedSeats}
                    totalPrice={totalPrice}
                />
            </div>
        </div>
    );
}
