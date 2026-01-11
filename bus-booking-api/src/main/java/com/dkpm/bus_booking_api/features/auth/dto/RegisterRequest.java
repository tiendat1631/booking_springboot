package com.dkpm.bus_booking_api.features.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email,

        @NotBlank(message = "Password is required") @Size(min = 6, message = "Password must be at least 6 characters") String password,

        @NotBlank(message = "First name is required") String firstName,

        @NotBlank(message = "Last name is required") String lastName,

        @NotBlank(message = "Phone number is required") String phone) {
}
