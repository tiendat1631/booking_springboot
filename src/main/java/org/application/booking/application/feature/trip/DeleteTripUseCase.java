package org.application.booking.application.feature.trip;

import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DeleteTripUseCase {
    private final TripRepository tripRepository;

    public DeleteTripUseCase(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }
    public void deleteTrip (UUID tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(()-> new RuntimeException("Trip not found" + tripId) );
        tripRepository.delete(trip);
    }
}
