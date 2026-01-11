package com.dkpm.bus_booking_api.features.auth.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken,
        long expiresIn) {
}
