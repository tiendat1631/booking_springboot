package com.dkpm.bus_booking_api.features.trip.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateTripRequest(

                @NotNull(message = "Bus ID is required") UUID busId,

                @NotNull(message = "Departure station ID is required") UUID departureStationId,

                @NotNull(message = "Destination station ID is required") UUID destinationStationId,

                @NotNull(message = "Departure time is required") @Future(message = "Departure time must be in the future") LocalDateTime departureTime,

                @NotNull(message = "Arrival time is required") @Future(message = "Arrival time must be in the future") LocalDateTime arrivalTime,

                @NotNull(message = "Price is required") @Positive(message = "Price must be positive") BigDecimal price) {
}
