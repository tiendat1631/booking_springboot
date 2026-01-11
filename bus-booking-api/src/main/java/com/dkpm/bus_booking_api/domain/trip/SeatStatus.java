package com.dkpm.bus_booking_api.domain.trip;

public enum SeatStatus {
    AVAILABLE, // Seat is available for booking
    RESERVED, // Seat is temporarily reserved (pending payment)
    BOOKED, // Seat is booked and paid
    BLOCKED // Seat is blocked by admin (e.g., maintenance)
}
