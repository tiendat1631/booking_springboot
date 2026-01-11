package com.dkpm.bus_booking_api.features.trip.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.dkpm.bus_booking_api.domain.trip.Trip;
import com.dkpm.bus_booking_api.domain.trip.TripStatus;

public record TripResponse(
                UUID tripId,
                RouteInfo route,

                BusInfo bus,

                StationInfo departureStation,
                StationInfo destinationStation,

                LocalDateTime departureTime,
                LocalDateTime arrivalTime,
                int durationMinutes,

                BigDecimal price,
                int availableSeats,
                int totalSeats,
                TripStatus status) {

        public record RouteInfo(
                        UUID id,
                        String name,
                        String code) {
        }

        public record StationInfo(
                        UUID id,
                        String name) {
        }

        public record BusInfo(
                        UUID id,
                        String licensePlate,
                        String type) {
        }

        public static TripResponse from(Trip trip) {
                RouteInfo routeInfo = new RouteInfo(
                                trip.getRoute().getId(),
                                trip.getRoute().getName(),
                                trip.getRoute().getCode());

                StationInfo departureStation = new StationInfo(
                                trip.getDepartureStation().getId(),
                                trip.getDepartureStation().getName());

                StationInfo destinationStation = new StationInfo(
                                trip.getDestinationStation().getId(),
                                trip.getDestinationStation().getName());

                BusInfo busInfo = new BusInfo(
                                trip.getBus().getId(),
                                trip.getBus().getLicensePlate(),
                                trip.getBus().getType().name());

                return new TripResponse(
                                trip.getId(),
                                routeInfo,
                                busInfo,
                                departureStation,
                                destinationStation,
                                trip.getDepartureTime(),
                                trip.getArrivalTime(),
                                trip.getDurationMinutes(),
                                trip.getPrice(),
                                trip.getAvailableSeats(),
                                trip.getTotalSeats(),
                                trip.getStatus());
        }
}
