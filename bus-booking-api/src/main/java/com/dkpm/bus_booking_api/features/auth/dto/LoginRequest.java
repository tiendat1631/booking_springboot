package com.dkpm.bus_booking_api.features.auth.dto;

public record LoginRequest(
        String username,
        String password) {
}
