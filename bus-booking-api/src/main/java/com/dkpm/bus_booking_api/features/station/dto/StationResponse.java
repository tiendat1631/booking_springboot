package com.dkpm.bus_booking_api.features.station.dto;

import java.util.UUID;

import com.dkpm.bus_booking_api.domain.station.Station;

public record StationResponse(
        UUID id,
        String name,
        String code,
        String address,
        String city,
        String province,
        Double latitude,
        Double longitude,
        boolean active) {

    public static StationResponse from(Station station) {
        return new StationResponse(
                station.getId(),
                station.getName(),
                station.getCode(),
                station.getAddress(),
                station.getCity(),
                station.getProvince(),
                station.getLatitude(),
                station.getLongitude(),
                station.isActive());
    }
}
