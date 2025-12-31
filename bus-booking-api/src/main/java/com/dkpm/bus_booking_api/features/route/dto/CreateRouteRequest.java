package com.dkpm.bus_booking_api.features.route.dto;

import java.math.BigDecimal;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateRouteRequest(
                @NotNull(message = "Departure province is required") @Valid ProvinceInput departureProvince,

                @NotNull(message = "Destination province is required") @Valid ProvinceInput destinationProvince,

                @Positive(message = "Distance must be positive") Integer distanceKm,

                @Positive(message = "Duration must be positive") Integer estimatedDurationMinutes,

                @Positive(message = "Base price must be positive") BigDecimal basePrice) {

        public record ProvinceInput(
                        @NotNull(message = "Province code is required") Integer code,
                        @NotBlank(message = "Province name is required") String name,
                        @NotBlank(message = "Province codename is required") String codename) {
        }
}
