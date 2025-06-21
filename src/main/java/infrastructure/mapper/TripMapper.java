package infrastructure.mapper;

import org.application.booking.domain.aggregates.TripModel.Ticket;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.presentation.DTO.TripInfoResponse;

public class TripMapper {
    public static TripInfoResponse toTripInfoResponse(Trip trip) {
        int availableSeats = 0;
        for (Ticket ticket : trip.getTickets()) {
            if (!ticket.isOccupied()){
                availableSeats++;
            }
        }
        if (trip.getBus() == null) {
            throw new IllegalStateException("Trip must have a bus assigned.");
        }
        return new TripInfoResponse(
                trip.getBus().getType(),
                trip.getPricePerSeat(),
                trip.getDeparture(),
                trip.getDestination(),
                trip.getTimeFrame(),
                availableSeats

        );
    }
}
