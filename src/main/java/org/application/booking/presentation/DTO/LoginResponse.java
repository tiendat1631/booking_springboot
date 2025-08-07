package org.application.booking.presentation.DTO;

import java.util.UUID;

public record LoginResponse(
        String token,
        UUID userId
) {
}
