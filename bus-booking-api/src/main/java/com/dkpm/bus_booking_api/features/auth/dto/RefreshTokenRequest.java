package com.dkpm.bus_booking_api.features.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
        @NotBlank(message = "Refresh token is required") String refreshToken) {
}
