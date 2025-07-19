package org.application.booking.application.feature.trip;

import lombok.RequiredArgsConstructor;
import org.application.booking.repository.TripRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteTripUseCase {
    private final TripRepository tripRepository;

    public void deleteTrip(DeleteTripRequest request) {
        tripRepository.deleteById(request.getTripId());
    }
}