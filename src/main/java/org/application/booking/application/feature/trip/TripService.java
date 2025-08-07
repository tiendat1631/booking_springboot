package org.application.booking.application.feature.trip;

import lombok.AllArgsConstructor;
import org.application.booking.application.common.exception.NotFoundException;
import org.application.booking.application.feature.trip.exception.BusScheduleConflictException;
import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.domain.aggregates.TripModel.Route;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.presentation.DTO.SearchTripRequest;
import org.application.booking.repository.BusRepository;
import org.application.booking.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@AllArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final BusRepository busRepository;


    public Trip getTrip(UUID tripId){
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new NotFoundException(Trip.class, tripId));
    }

    public List<Trip> getTrips(SearchTripRequest request){
        return tripRepository.findAll(request.toSpecification());
    }

    public void addTrip(AddTripRequest request) {
        Bus bus = busRepository.findById(request.busId())
                .orElseThrow(() -> new NotFoundException(Bus.class, request.busId()));

        // ===== Kiểm tra trùng chuyến =====
        if(tripRepository.isBusBusyDuring(
                request.departureTime(),
                request.estimateArrivalTime(),
                request.busId()))
            throw new BusScheduleConflictException();

        // ===== Chuyển từ DTO sang VO =====
        Route route = request.route().toRoute();

        Trip trip = Trip.Create(
                route,
                bus,
                request.departureTime(),
                request.estimateArrivalTime(),
                request.price()
        );

        tripRepository.save(trip);

    }
    public void deleteTrip(UUID tripId){
        tripRepository.deleteById(tripId);
    }
}
