package org.application.booking.controller.dto;

import org.application.booking.domain.aggregates.BusModel.BusType;
import org.application.booking.domain.aggregates.TripModel.Trip;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TripResponse(
        UUID id,
        String departureName,
        String destinationName,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        BusDTO bus,
        List<TicketDTO> tickets,
        double ticketPrice
) {
    public static TripResponse from(Trip trip) {
        List<TicketDTO> ticketDTOs = trip.getTickets().stream()
                .map(ticket -> new TicketDTO(
                        ticket.getId(),
                        ticket.isOccupied(),
                        ticket.getSeat().getSeatNum()
                ))
                .toList();

        BusDTO busDTO = new BusDTO(
                trip.getBus().getId(),
                trip.getBus().getLicensePlate(),
                trip.getBus().getCapacity(),
                trip.getBus().getType()
        );

        assert trip.getRoute().getDeparture() != null;
        assert trip.getRoute().getDestination() != null;

        return new TripResponse(
                trip.getId(),
                trip.getRoute().getDeparture().getName(),
                trip.getRoute().getDestination().getName(),
                trip.getDepartureTime(),
                trip.getEstimatedArrivalTime(),
                busDTO,
                ticketDTOs,
                trip.getTicketPrice()
        );
    }
}

record TicketDTO(
        UUID id,
        boolean isOccupied,
        int seatNum
) {
}

record BusDTO(
        UUID id,
        String licensePlate,
        int capacity,
        BusType type
) {

}