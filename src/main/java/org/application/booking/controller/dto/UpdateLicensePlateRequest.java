package org.application.booking.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateLicensePlateRequest(
        @NotBlank String licensePlate
) {
}
