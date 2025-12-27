"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================================================
// Booking Cart Store - For multi-step booking flow
// ============================================================================

interface SelectedSeat {
    seatNumber: string;
    price: number;
}

interface PassengerInfo {
    name: string;
    email: string;
    phone: string;
}

interface BookingCartState {
    // State
    tripId: string | null;
    selectedSeats: SelectedSeat[];
    passengerInfo: PassengerInfo | null;

    // Computed
    totalPrice: number;
    seatCount: number;

    // Actions
    setTrip: (tripId: string) => void;
    addSeat: (seat: SelectedSeat) => void;
    removeSeat: (seatNumber: string) => void;
    toggleSeat: (seat: SelectedSeat) => void;
    isSeatSelected: (seatNumber: string) => boolean;
    setPassengerInfo: (info: PassengerInfo) => void;
    clearCart: () => void;
    reset: () => void;
}

const initialState = {
    tripId: null,
    selectedSeats: [],
    passengerInfo: null,
    totalPrice: 0,
    seatCount: 0,
};

export const useBookingCartStore = create<BookingCartState>()(
    persist(
        (set, get) => ({
            ...initialState,

            setTrip: (tripId) => {
                const currentTripId = get().tripId;
                // Clear seats if switching to different trip
                if (currentTripId && currentTripId !== tripId) {
                    set({ tripId, selectedSeats: [], totalPrice: 0, seatCount: 0 });
                } else {
                    set({ tripId });
                }
            },

            addSeat: (seat) => {
                const currentSeats = get().selectedSeats;
                if (currentSeats.some((s) => s.seatNumber === seat.seatNumber)) {
                    return; // Already selected
                }
                const newSeats = [...currentSeats, seat];
                set({
                    selectedSeats: newSeats,
                    totalPrice: newSeats.reduce((sum, s) => sum + s.price, 0),
                    seatCount: newSeats.length,
                });
            },

            removeSeat: (seatNumber) => {
                const newSeats = get().selectedSeats.filter(
                    (s) => s.seatNumber !== seatNumber
                );
                set({
                    selectedSeats: newSeats,
                    totalPrice: newSeats.reduce((sum, s) => sum + s.price, 0),
                    seatCount: newSeats.length,
                });
            },

            toggleSeat: (seat) => {
                const isSelected = get().isSeatSelected(seat.seatNumber);
                if (isSelected) {
                    get().removeSeat(seat.seatNumber);
                } else {
                    get().addSeat(seat);
                }
            },

            isSeatSelected: (seatNumber) => {
                return get().selectedSeats.some((s) => s.seatNumber === seatNumber);
            },

            setPassengerInfo: (info) => {
                set({ passengerInfo: info });
            },

            clearCart: () => {
                set(initialState);
            },

            reset: () => {
                set(initialState);
            },
        }),
        {
            name: "booking-cart",
            // Only persist tripId and selectedSeats, not passengerInfo for privacy
            partialize: (state) => ({
                tripId: state.tripId,
                selectedSeats: state.selectedSeats,
                totalPrice: state.totalPrice,
                seatCount: state.seatCount,
            }),
        }
    )
);
