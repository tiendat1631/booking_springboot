package org.application.booking.controller.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.domain.aggregates.BusModel.BusType;
import org.application.booking.domain.aggregates.BusModel.Seat;

import java.util.List;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record BusResponse(
        UUID id,
        String licensePlate,
        BusType type,
        int capacity,
        List<SeatDTO> seats
) {
    public static BusResponse fromWithSeat(Bus bus) {
        return new BusResponse(
                bus.getId(),
                bus.getLicensePlate(),
                bus.getType(),
                bus.getCapacity(),
                bus.getSeats().stream().map(SeatDTO::from).toList()
        );
    }

    public static BusResponse fromWithNoSeat(Bus bus) {
        return new BusResponse(
                bus.getId(),
                bus.getLicensePlate(),
                bus.getType(),
                bus.getCapacity(),
                null
        );
    }
}

record SeatDTO(
        UUID id,
        int seatNum
) {
    public static SeatDTO from(Seat seat) {
        return new SeatDTO(seat.getId(), seat.getSeatNum());
    }
}
