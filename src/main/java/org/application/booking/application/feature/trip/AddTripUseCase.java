package org.application.booking.application.feature.trip;

import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.repository.BusRepository;
import org.application.booking.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AddTripUseCase {
    private final TripRepository tripRepository;
    private final BusRepository busRepository;
    public AddTripUseCase(TripRepository tripRepository, BusRepository busRepository) {
        this.tripRepository = tripRepository;
        this.busRepository = busRepository;
    }

    public void addTrip(AddTripRequest request) {
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid bus id: " + request.getBusId()));

        // TODO: Kiểm tra Bus trùng chuyen di khac hay khong

//        String normalizeDeparture = ProvinceConverter.convert(addTripRequest.getDeparture());
//        String normalizeDestination = ProvinceConverter.convert(addTripRequest.getDestination());
        Trip trip = Trip.createTrip(
                request.getDeparture(),
                request.getDestination(),
                request.getPrice(),
                request.getTimeFrame(),
                bus
        );

        tripRepository.save(trip);

    }
}
