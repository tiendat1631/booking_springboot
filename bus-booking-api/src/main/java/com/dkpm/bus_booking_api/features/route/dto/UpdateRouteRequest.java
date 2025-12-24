package com.dkpm.bus_booking_api.features.route.dto;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record UpdateRouteRequest(
        String name,

        @Size(max = 20, message = "Route code must be at most 20 characters") String code,

        UUID departureStationId,

        UUID arrivalStationId,

        @Positive(message = "Distance must be positive") Integer distanceKm,

        @Positive(message = "Duration must be positive") Integer estimatedDurationMinutes,

        @Positive(message = "Base price must be positive") BigDecimal basePrice,

        String description,

        Boolean active) {
}
