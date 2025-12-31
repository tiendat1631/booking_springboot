package com.dkpm.bus_booking_api.features.route.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Positive;

public record UpdateRouteRequest(

        @Positive(message = "Distance must be positive") Integer distanceKm,

        @Positive(message = "Duration must be positive") Integer estimatedDurationMinutes,

        @Positive(message = "Base price must be positive") BigDecimal basePrice,

        Boolean active) {
}
