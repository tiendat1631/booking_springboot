package com.dkpm.bus_booking_api.features.trip.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.dkpm.bus_booking_api.domain.trip.Ticket;
import com.dkpm.bus_booking_api.domain.trip.Trip;
import com.dkpm.bus_booking_api.domain.trip.TripStatus;

public record TripDetailResponse(
                UUID tripId,
                RouteDetail route,
                BusDetail bus,
                StationDetail departureStation,
                StationDetail destinationStation,
                LocalDateTime departureTime,
                LocalDateTime arrivalTime,
                String formattedDuration,
                int durationMinutes,
                BigDecimal price,
                int availableSeats,
                int totalSeats,
                TripStatus status,
                SeatLayoutInfo seatLayout,
                List<SeatInfo> seats) {

        public record RouteDetail(
                        UUID id,
                        String name,
                        String code,
                        String departureProvinceName,
                        String destinationProvinceName,
                        Integer distanceKm) {
        }

        public record StationDetail(
                        UUID id,
                        String name,
                        String address,
                        String provinceName) {
        }

        public record BusDetail(
                        UUID id,
                        String licensePlate,
                        String type,
                        int totalSeats) {
        }

        public record SeatLayoutInfo(
                        int totalRows,
                        int totalColumns) {
        }

        public record SeatInfo(
                        String seatId,
                        int row,
                        int col,
                        String status,
                        BigDecimal price) {
        }

        public static TripDetailResponse from(Trip trip, List<Ticket> tickets) {
                StationDetail departureStation = new StationDetail(
                                trip.getDepartureStation().getId(),
                                trip.getDepartureStation().getName(),
                                trip.getDepartureStation().getAddress(),
                                trip.getDepartureStation().getProvince() != null
                                                ? trip.getDepartureStation().getProvince().getName()
                                                : null);

                StationDetail destinationStation = new StationDetail(
                                trip.getDestinationStation().getId(),
                                trip.getDestinationStation().getName(),
                                trip.getDestinationStation().getAddress(),
                                trip.getDestinationStation().getProvince() != null
                                                ? trip.getDestinationStation().getProvince().getName()
                                                : null);

                RouteDetail routeDetail = new RouteDetail(
                                trip.getRoute().getId(),
                                trip.getRoute().getName(),
                                trip.getRoute().getCode(),
                                trip.getRoute().getDepartureProvince() != null
                                                ? trip.getRoute().getDepartureProvince().getName()
                                                : null,
                                trip.getRoute().getDestinationProvince() != null
                                                ? trip.getRoute().getDestinationProvince().getName()
                                                : null,
                                trip.getRoute().getDistanceKm());

                BusDetail busDetail = new BusDetail(
                                trip.getBus().getId(),
                                trip.getBus().getLicensePlate(),
                                trip.getBus().getType().name(),
                                trip.getBus().getTotalSeats());

                SeatLayoutInfo layoutInfo = null;
                if (trip.getBus().getSeatLayout() != null) {
                        layoutInfo = new SeatLayoutInfo(
                                        trip.getBus().getSeatLayout().getTotalRows(),
                                        trip.getBus().getSeatLayout().getTotalColumns());
                }

                List<SeatInfo> seatInfos = tickets.stream()
                                .map(ticket -> new SeatInfo(
                                                ticket.getSeatId(),
                                                ticket.getRow(),
                                                ticket.getCol(),
                                                ticket.getStatus().name(),
                                                ticket.getPrice()))
                                .toList();

                return new TripDetailResponse(
                                trip.getId(),
                                routeDetail,
                                busDetail,
                                departureStation,
                                destinationStation,
                                trip.getDepartureTime(),
                                trip.getArrivalTime(),
                                formatDuration(trip.getDurationMinutes()),
                                trip.getDurationMinutes(),
                                trip.getPrice(),
                                trip.getAvailableSeats(),
                                trip.getTotalSeats(),
                                trip.getStatus(),
                                layoutInfo,
                                seatInfos);
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
