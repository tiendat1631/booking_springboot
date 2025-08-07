package org.application.booking.application.feature.booking;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

public record CreateBookingRequest(
        @NotNull UUID tripId,
        @NotEmpty List<UUID> seatIds,
        UUID userId
) { }
