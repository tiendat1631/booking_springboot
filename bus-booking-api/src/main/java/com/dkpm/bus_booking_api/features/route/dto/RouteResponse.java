package com.dkpm.bus_booking_api.features.route.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.dkpm.bus_booking_api.domain.route.Route;

public record RouteResponse(
                UUID id,
                String name,
                String code,
                ProvinceSummary departureProvince,
                ProvinceSummary destinationProvince,
                Integer distanceKm,
                Integer estimatedDurationMinutes,
                BigDecimal basePrice,
                boolean active) {

        public record ProvinceSummary(
                        Integer code,
                        String name,
                        String codename) {
        }

        public static RouteResponse from(Route route) {
                ProvinceSummary departure = null;
                if (route.getDepartureProvince() != null) {
                        departure = new ProvinceSummary(
                                        route.getDepartureProvince().getCode(),
                                        route.getDepartureProvince().getName(),
                                        route.getDepartureProvince().getCodename());
                }

                ProvinceSummary destination = null;
                if (route.getDestinationProvince() != null) {
                        destination = new ProvinceSummary(
                                        route.getDestinationProvince().getCode(),
                                        route.getDestinationProvince().getName(),
                                        route.getDestinationProvince().getCodename());
                }

                return new RouteResponse(
                                route.getId(),
                                route.getName(),
                                route.getCode(),
                                departure,
                                destination,
                                route.getDistanceKm(),
                                route.getEstimatedDurationMinutes(),
                                route.getBasePrice(),
                                route.isActive());
        }
}
