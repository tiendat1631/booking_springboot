package com.dkpm.bus_booking_api.features.bus.dto;

import com.dkpm.bus_booking_api.domain.bus.BusType;

public record CreateBusRequest(
                String licensePlate,
                BusType type) {
}
