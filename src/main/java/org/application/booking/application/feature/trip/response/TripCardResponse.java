package org.application.booking.application.feature.trip.response;

import org.application.booking.domain.aggregates.TripModel.Trip;

import java.time.LocalDateTime;
import java.util.List;

public record TripCardResponse(
        String id,
        String departureName,
        String destinationName,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        List<TicketDTO> tickets,
        double ticketPrice
) {
    public static TripCardResponse toTripCardResponse(Trip trip) {
        List<TicketDTO> ticketDTOs = trip.getTickets().stream()
                .map(ticket -> new TicketDTO(
                        ticket.getId().toString(),
                        ticket.isOccupied(),
                        ticket.getSeat().getSeatNum()
                ))
                .toList();

        assert trip.getRoute().getDeparture() != null;
        assert trip.getRoute().getDestination() != null;

        return new TripCardResponse(
                trip.getId().toString(),
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
        String id,
        boolean isOccupied,
        int seatNum
) {}