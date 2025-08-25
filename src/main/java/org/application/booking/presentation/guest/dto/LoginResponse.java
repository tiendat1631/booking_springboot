package org.application.booking.presentation.guest.dto;

import org.application.booking.domain.aggregates.UserModel.User;

import java.util.UUID;

public record LoginResponse(
        String accessToken,
        UserResponse user
) {
    public static LoginResponse create(String accessToken, User user) {
        return new LoginResponse(accessToken,
                new UserResponse(user.getId(),
                        user.getName(),
                        user.getEmail().getEmail())
        );
    }
}

record UserResponse(
        UUID id,
        String username,
        String email
) {
}
