package com.dkpm.bus_booking_api.features.trip.dto;

import java.util.UUID;

public record PopularTripResponse(
        UUID tripId,
        String routeCode,
        String departureProvince,
        String destinationProvince,

        long totalBookings
) {
}
