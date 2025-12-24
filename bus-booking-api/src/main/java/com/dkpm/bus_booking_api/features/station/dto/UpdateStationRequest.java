package com.dkpm.bus_booking_api.features.station.dto;

import jakarta.validation.constraints.Size;

public record UpdateStationRequest(
        String name,

        @Size(max = 10, message = "Station code must be at most 10 characters") String code,

        String address,

        @Size(max = 100, message = "City must be at most 100 characters") String city,

        @Size(max = 100, message = "Province must be at most 100 characters") String province,

        Double latitude,

        Double longitude,

        Boolean active) {
}
