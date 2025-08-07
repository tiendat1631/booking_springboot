package org.application.booking.application.feature.bus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.application.booking.domain.aggregates.BusModel.BusType;

import java.util.UUID;

public record UpdateLicensePlateRequest(
        @NotBlank String licensePlate
) { }
