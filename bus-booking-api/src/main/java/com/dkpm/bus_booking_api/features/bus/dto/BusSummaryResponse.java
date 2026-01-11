package com.dkpm.bus_booking_api.features.bus.dto;

import com.dkpm.bus_booking_api.domain.bus.Bus;
import com.dkpm.bus_booking_api.domain.bus.BusStatus;
import com.dkpm.bus_booking_api.domain.bus.BusType;

import java.time.LocalDateTime;
import java.util.UUID;

public record BusSummaryResponse(
        UUID id,
        String licensePlate,
        BusType type,
        BusStatus status,
        int totalSeats,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
    public static BusSummaryResponse from(Bus bus) {
        return new BusSummaryResponse(
                bus.getId(),
                bus.getLicensePlate(),
                bus.getType(),
                bus.getStatus(),
                bus.getTotalSeats(),
                bus.getCreatedAt(),
                bus.getUpdatedAt());
    }
}