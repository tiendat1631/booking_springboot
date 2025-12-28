package com.dkpm.bus_booking_api.features.station.dto;

import java.util.UUID;

import com.dkpm.bus_booking_api.domain.station.Station;

public record StationResponse(
                UUID id,
                String name,
                String address,
                ProvinceResponse province,
                Double latitude,
                Double longitude,
                boolean active) {

        public static StationResponse from(Station station) {
                ProvinceResponse provinceResponse = null;
                if (station.getProvince() != null) {
                        provinceResponse = new ProvinceResponse(
                                        station.getProvince().getCode(),
                                        station.getProvince().getName(),
                                        station.getProvince().getCodename());
                }

                return new StationResponse(
                                station.getId(),
                                station.getName(),
                                station.getAddress(),
                                provinceResponse,
                                station.getLatitude(),
                                station.getLongitude(),
                                station.isActive());
        }

        public record ProvinceResponse(
                        Integer code,
                        String name,
                        String codename) {
        }
}
