package com.dkpm.bus_booking_api.features.profile.dto;

import java.util.UUID;

public record ProfileResponse(
        UUID id,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        String role,
        boolean emailVerified) {
}
