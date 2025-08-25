package org.application.booking.application.feature.bus.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateLicensePlateRequest(
        @NotBlank String licensePlate
) {
}
