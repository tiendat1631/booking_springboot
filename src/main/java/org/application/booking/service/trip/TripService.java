package org.application.booking.service.trip;

import lombok.RequiredArgsConstructor;
import org.application.booking.controller.dto.AddTripRequest;
import org.application.booking.controller.dto.SearchTripRequest;
import org.application.booking.controller.dto.TripCardResponse;
import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.domain.aggregates.TripModel.Route;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.exception.BusScheduleConflictException;
import org.application.booking.exception.NotFoundException;
import org.application.booking.repository.BusRepository;
import org.application.booking.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final BusRepository busRepository;

    public Trip getTrip(UUID tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new NotFoundException(Trip.class, tripId));
    }

    public List<TripCardResponse> getTrips(SearchTripRequest request) {
        List<Trip> trips = tripRepository.findAll(request.toSpecification());
        return trips.stream()
                .map(TripCardResponse::from)
                .toList();
    }

    public void addTrip(AddTripRequest request) {
        Bus bus = busRepository.findById(request.busId())
                .orElseThrow(() -> new NotFoundException(Bus.class, request.busId()));

        // ===== Kiểm tra trùng chuyến =====
        if (tripRepository.isBusBusyDuring(
                request.departureTime(),
                request.estimateArrivalTime(),
                request.busId()))
            throw new BusScheduleConflictException();

        // ===== Chuyển từ DTO sang VO =====
        Route route = request.getRoute();

        Trip trip = Trip.Create(
                route,
                bus,
                request.departureTime(),
                request.estimateArrivalTime(),
                request.price()
        );

        tripRepository.save(trip);

    }

    public void deleteTrip(UUID tripId) {
        tripRepository.deleteById(tripId);
    }
}
