package org.application.booking.controller.dto;


import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record CreateBookingForUserRequest(
        @NotNull UUID tripId,
        @NotEmpty List<UUID> seatIds,
        UUID userId
) {
}
