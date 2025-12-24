package com.dkpm.bus_booking_api.features.route.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.dkpm.bus_booking_api.domain.route.Route;

public record RouteResponse(
        UUID id,
        String name,
        String code,
        StationSummary departureStation,
        StationSummary arrivalStation,
        Integer distanceKm,
        Integer estimatedDurationMinutes,
        String formattedDuration,
        BigDecimal basePrice,
        String description,
        boolean active) {

    public record StationSummary(
            UUID id,
            String name,
            String code,
            String city) {
    }

    public static RouteResponse from(Route route) {
        StationSummary departure = new StationSummary(
                route.getDepartureStation().getId(),
                route.getDepartureStation().getName(),
                route.getDepartureStation().getCode(),
                route.getDepartureStation().getCity());

        StationSummary arrival = new StationSummary(
                route.getArrivalStation().getId(),
                route.getArrivalStation().getName(),
                route.getArrivalStation().getCode(),
                route.getArrivalStation().getCity());

        String formattedDuration = formatDuration(route.getEstimatedDurationMinutes());

        return new RouteResponse(
                route.getId(),
                route.getName(),
                route.getCode(),
                departure,
                arrival,
                route.getDistanceKm(),
                route.getEstimatedDurationMinutes(),
                formattedDuration,
                route.getBasePrice(),
                route.getDescription(),
                route.isActive());
    }

    private static String formatDuration(Integer minutes) {
        if (minutes == null) {
            return null;
        }
        int hours = minutes / 60;
        int mins = minutes % 60;
        if (hours > 0 && mins > 0) {
            return hours + "h " + mins + "m";
        } else if (hours > 0) {
            return hours + "h";
        } else {
            return mins + "m";
        }
    }
}
