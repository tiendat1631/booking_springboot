package com.dkpm.bus_booking_api.features.station.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateStationRequest(
                @NotBlank(message = "Station name is required") String name,
                @NotBlank(message = "Address is required") String address,
                @Valid @NotNull(message = "Province is required") ProvinceRequest province) {
        public record ProvinceRequest(
                        @NotNull(message = "Province code is required") Integer code,

                        @NotBlank(message = "Province name is required") String name,

                        String codename) {
        }
}
