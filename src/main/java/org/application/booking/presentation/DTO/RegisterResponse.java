package org.application.booking.presentation.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RegisterResponse {
    private String message;
    private UUID userId;
    private String token;
    private String refreshToken;
}
