package org.application.booking.application.feature.trip;

import org.application.booking.domain.entity.BusBoundary.Bus;
import org.application.booking.domain.entity.Ticket;
import org.application.booking.domain.entity.Trip;
import org.application.booking.repository.BusRepository;
import org.application.booking.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddTripUseCase {
    private final TripRepository tripRepository;
    private final BusRepository busRepository;
    public AddTripUseCase(TripRepository tripRepository, BusRepository busRepository) {
        this.tripRepository = tripRepository;
        this.busRepository = busRepository;
    }

    public void addTrip(AddTripRequest addTripRequest) {
        Bus bus = busRepository.findById(addTripRequest.getBusId())
                .orElseThrow(() -> new IllegalArgumentException("Bus not found with ID: " + addTripRequest.getBusId()));

        Trip trip = Trip.createTrip(
                addTripRequest.getDeparture(),
                addTripRequest.getDestination(),
                addTripRequest.getPrice(),
                addTripRequest.getTimeFrame(),
                bus
        );
        List<Ticket> tickets = trip.generateTicketsFromSeats(bus.getSeats());
        trip.setTickets(tickets);
        tripRepository.save(trip);
    }
}
