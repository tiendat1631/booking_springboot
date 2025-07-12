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

    public void addTrip(AddTripRequest addTripRequest) {
        List<Bus> buses = new ArrayList<>();
        // lay danh sach Bus tu busId
        for (UUID busId : addTripRequest.getBusIds()) {
            Bus bus = busRepository.findById(busId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid bus id: " + busId));

            if (bus.getTrip() != null) {
                throw new IllegalArgumentException("Bus with this id: " + busId + " is already assigned");
            }
            buses.add(bus);
        }

//        String normalizeDeparture = ProvinceConverter.convert(addTripRequest.getDeparture());
//        String normalizeDestination = ProvinceConverter.convert(addTripRequest.getDestination());
        Trip trip = Trip.createTrip(
                addTripRequest.getDeparture(),
                addTripRequest.getDestination(),
                addTripRequest.getPrice(),
                addTripRequest.getTimeFrame(),
                buses
        );

        // sau khi save trip nay thi trip nay se co 1 list cac bus
        tripRepository.save(trip);

    }
}
