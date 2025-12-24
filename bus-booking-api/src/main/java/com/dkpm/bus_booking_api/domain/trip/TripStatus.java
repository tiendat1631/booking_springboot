package com.dkpm.bus_booking_api.domain.trip;

public enum TripStatus {
    SCHEDULED, // Trip is scheduled for future
    BOARDING, // Passengers are boarding
    IN_TRANSIT, // Bus is on the way
    COMPLETED, // Trip completed
    CANCELLED // Trip was cancelled
}
