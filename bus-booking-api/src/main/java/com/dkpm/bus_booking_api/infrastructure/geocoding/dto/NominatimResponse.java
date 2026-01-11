package com.dkpm.bus_booking_api.infrastructure.geocoding.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record NominatimResponse(
        String lat,
        String lon,
        String display_name) {
}
