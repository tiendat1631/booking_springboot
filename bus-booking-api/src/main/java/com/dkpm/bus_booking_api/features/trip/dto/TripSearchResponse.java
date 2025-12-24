package com.dkpm.bus_booking_api.features.trip.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.dkpm.bus_booking_api.domain.trip.Trip;
import com.dkpm.bus_booking_api.domain.trip.TripStatus;

public record TripSearchResponse(
        UUID tripId,
        RouteInfo route,
        BusInfo bus,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        String formattedDuration,
        BigDecimal price,
        int availableSeats,
        int totalSeats,
        TripStatus status) {

    public record RouteInfo(
            UUID id,
            String name,
            String code,
            String departureStation,
            String departureCity,
            String arrivalStation,
            String arrivalCity) {
    }

    public record BusInfo(
            UUID id,
            String licensePlate,
            String type) {
    }

    public static TripSearchResponse from(Trip trip) {
        RouteInfo routeInfo = new RouteInfo(
                trip.getRoute().getId(),
                trip.getRoute().getName(),
                trip.getRoute().getCode(),
                trip.getRoute().getDepartureStation().getName(),
                trip.getRoute().getDepartureStation().getCity(),
                trip.getRoute().getArrivalStation().getName(),
                trip.getRoute().getArrivalStation().getCity());

        BusInfo busInfo = new BusInfo(
                trip.getBus().getId(),
                trip.getBus().getLicensePlate(),
                trip.getBus().getType().name());

        return new TripSearchResponse(
                trip.getId(),
                routeInfo,
                busInfo,
                trip.getDepartureTime(),
                trip.getArrivalTime(),
                formatDuration(trip.getDurationMinutes()),
                trip.getPrice(),
                trip.getAvailableSeats(),
                trip.getTotalSeats(),
                trip.getStatus());
    }

    private static String formatDuration(int minutes) {
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
