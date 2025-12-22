package org.application.booking.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.application.booking.domain.aggregates.BusModel.BusType;

public record AddBusRequest(
        @NotNull BusType busType,
        @NotBlank String licensePlate
) {
}
