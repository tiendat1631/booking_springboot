package org.application.booking.application.feature.booking;


import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record CreateBookingRequest(
        @NotNull UUID tripId,
        @NotEmpty List<UUID> seatIds,
        UUID userId
) {
}
