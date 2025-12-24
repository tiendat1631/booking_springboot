package com.dkpm.bus_booking_api.features.bus.dto;

import com.dkpm.bus_booking_api.domain.bus.Bus;
import com.dkpm.bus_booking_api.domain.bus.BusStatus;
import com.dkpm.bus_booking_api.domain.bus.BusType;
import com.dkpm.bus_booking_api.domain.bus.SeatLayout;

import java.time.Instant;
import java.util.UUID;

public record BusDetailResponse(
        UUID id,
        String licensePlate,
        BusType type,
        BusStatus status,
        int totalSeats,
        SeatLayout seatLayout,
        Instant createdAt,
        Instant updatedAt) {
    public static BusDetailResponse from(Bus bus) {
        return new BusDetailResponse(
                bus.getId(),
                bus.getLicensePlate(),
                bus.getType(),
                bus.getStatus(),
                bus.getTotalSeats(),
                bus.getSeatLayout(),
                bus.getCreatedAt(),
                bus.getUpdatedAt());
    }
}