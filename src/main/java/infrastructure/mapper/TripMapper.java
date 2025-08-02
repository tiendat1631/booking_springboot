package infrastructure.mapper;

import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.presentation.DTO.TripInfoResponse;

import java.util.ArrayList;
import java.util.List;


public class TripMapper {
    public static TripInfoResponse toTripInfoResponse(Trip trip) {
        List<TripInfoResponse.BusInfo> busInfoList = new ArrayList<>();

        Bus bus = trip.getBus();
        int availableSeats = (int) bus.getSeats().stream()
                .filter(seat -> trip.getTickets().stream()
                        .anyMatch(ticket -> ticket.getSeat().getId().equals(seat.getId()) && !ticket.isOccupied()))
                .count();

        TripInfoResponse.BusInfo busInfo = new TripInfoResponse.BusInfo(
                bus.getId(),
                bus.getType(),
                availableSeats
        );
        busInfoList.add(busInfo);


        return new TripInfoResponse(
                trip.getId(),
                trip.getPricePerSeat(),
                trip.getDeparture(),
                trip.getDestination(),
                trip.getTimeFrame(),
                busInfoList
        );
    }
}
