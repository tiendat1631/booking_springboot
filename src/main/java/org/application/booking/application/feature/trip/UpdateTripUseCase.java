package org.application.booking.application.feature.trip;

import lombok.RequiredArgsConstructor;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.domain.aggregates.TripModel.TimeFrame;
import org.application.booking.repository.BusRepository;
import org.application.booking.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateTripUseCase {

    private final TripRepository tripRepository;
    private final BusRepository busRepository;

    public void updateTrip(UpdateTripRequest request) {
        Optional<Trip> optionalTrip = tripRepository.findById(request.getTripId());
        if (optionalTrip.isEmpty()) {
            throw new IllegalArgumentException("Trip not found");
        }

        Trip trip = optionalTrip.get();

        trip.setDeparture(request.getDeparture());
        trip.setDestination(request.getDestination());
        trip.setPricePerSeat(request.getPrice());
        trip.setTimeFrame(request.getTimeFrame());
        trip.setBus(busRepository.findById(request.getBusId())
                .orElseThrow(() -> new IllegalArgumentException("Bus not found")));

        tripRepository.save(trip);
    }
}
