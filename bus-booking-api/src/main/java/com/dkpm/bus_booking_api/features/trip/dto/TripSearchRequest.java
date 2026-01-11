package com.dkpm.bus_booking_api.features.trip.dto;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record TripSearchRequest(
        @NotNull(message = "Departure station is required") UUID departureStationId,

        @NotNull(message = "Arrival station is required") UUID arrivalStationId,

        @NotNull(message = "Departure date is required") LocalDate departureDate,

        @Min(value = 1, message = "At least 1 passenger is required") int passengers) {

    public TripSearchRequest {
        if (passengers < 1) {
            passengers = 1;
        }
    }
}
