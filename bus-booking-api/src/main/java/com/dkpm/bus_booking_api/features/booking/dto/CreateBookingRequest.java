package com.dkpm.bus_booking_api.features.booking.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CreateBookingRequest(
        @NotNull(message = "Trip ID is required") UUID tripId,

        @NotEmpty(message = "At least one seat must be selected") List<String> seatIds,

        @NotBlank(message = "Passenger name is required") String passengerName,

        @NotBlank(message = "Passenger phone is required") @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Invalid phone number format") String passengerPhone,

        @Email(message = "Invalid email format") String passengerEmail,

        String notes) {
}
