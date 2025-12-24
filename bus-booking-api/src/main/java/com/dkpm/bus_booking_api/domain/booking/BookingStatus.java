package com.dkpm.bus_booking_api.domain.booking;

public enum BookingStatus {
    PENDING, // Booking created, awaiting payment
    CONFIRMED, // Payment completed, booking confirmed
    CANCELLED, // Booking was cancelled by user or system
    COMPLETED, // Trip completed
    EXPIRED // Booking expired (payment timeout)
}
