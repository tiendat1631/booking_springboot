package org.application.booking.presentation.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
public record LoginRequest(
        @NotBlank String username,
        @NotBlank String password
) { }
