package com.dkpm.bus_booking_api.features.trip.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.dkpm.bus_booking_api.domain.trip.Trip;
import com.dkpm.bus_booking_api.domain.trip.TripSeat;
import com.dkpm.bus_booking_api.domain.trip.TripStatus;

public record TripDetailResponse(
        UUID tripId,
        RouteDetail route,
        BusDetail bus,
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
            StationDetail departureStation,
            StationDetail arrivalStation,
            Integer distanceKm) {
    }

    public record StationDetail(
            UUID id,
            String name,
            String code,
            String address,
            String city) {
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

    public static TripDetailResponse from(Trip trip, List<TripSeat> tripSeats) {
        StationDetail departureStation = new StationDetail(
                trip.getRoute().getDepartureStation().getId(),
                trip.getRoute().getDepartureStation().getName(),
                trip.getRoute().getDepartureStation().getCode(),
                trip.getRoute().getDepartureStation().getAddress(),
                trip.getRoute().getDepartureStation().getCity());

        StationDetail arrivalStation = new StationDetail(
                trip.getRoute().getArrivalStation().getId(),
                trip.getRoute().getArrivalStation().getName(),
                trip.getRoute().getArrivalStation().getCode(),
                trip.getRoute().getArrivalStation().getAddress(),
                trip.getRoute().getArrivalStation().getCity());

        RouteDetail routeDetail = new RouteDetail(
                trip.getRoute().getId(),
                trip.getRoute().getName(),
                trip.getRoute().getCode(),
                departureStation,
                arrivalStation,
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

        List<SeatInfo> seatInfos = tripSeats.stream()
                .map(seat -> new SeatInfo(
                        seat.getSeatId(),
                        seat.getRow(),
                        seat.getCol(),
                        seat.getStatus().name(),
                        seat.getFinalPrice(trip.getPrice())))
                .toList();

        return new TripDetailResponse(
                trip.getId(),
                routeDetail,
                busDetail,
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
