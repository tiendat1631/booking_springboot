package com.dkpm.bus_booking_api.features.station.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateStationRequest(
                String name,

                String address,

                @Valid ProvinceRequest province,

                Boolean active) {
        public record ProvinceRequest(
                        @NotNull(message = "Province code is required") Integer code,

                        @NotBlank(message = "Province name is required") String name,

                        String codename) {
        }
}
