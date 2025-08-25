package org.application.booking.controller.dto;

import org.application.booking.domain.aggregates.TripModel.Trip;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TripCardResponse(
        UUID id,
        String departureName,
        String destinationName,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        List<TicketDTO> tickets,
        double ticketPrice
) {
    public static TripCardResponse from(Trip trip) {
        List<TicketDTO> ticketDTOs = trip.getTickets().stream()
                .map(ticket -> new TicketDTO(
                        ticket.getId(),
                        ticket.isOccupied(),
                        ticket.getSeat().getSeatNum()
                ))
                .toList();

        assert trip.getRoute().getDeparture() != null;
        assert trip.getRoute().getDestination() != null;

        return new TripCardResponse(
                trip.getId(),
                trip.getRoute().getDeparture().getName(),
                trip.getRoute().getDestination().getName(),
                trip.getDepartureTime(),
                trip.getEstimatedArrivalTime(),
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