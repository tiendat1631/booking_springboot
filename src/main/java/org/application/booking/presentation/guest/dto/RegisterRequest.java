package org.application.booking.presentation.guest.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(
        @NotBlank String name,
        @NotBlank String username,
        @NotBlank String email,
        @NotNull(message = "Age is required")
        @Min(value = 18, message = "Age cannot be negative!!")
        int age,
        @NotBlank String password
        /*, @NotBlank String phoneNum */ // nếu muốn dùng phoneNum, bỏ comment
) {
}