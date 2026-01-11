package com.dkpm.bus_booking_api.features.trip.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.dkpm.bus_booking_api.domain.trip.TripStatus;

import jakarta.validation.constraints.Positive;

public record UpdateTripRequest(
        LocalDateTime departureTime,

        LocalDateTime arrivalTime,

        @Positive(message = "Price must be positive") BigDecimal price,

        TripStatus status) {
}
