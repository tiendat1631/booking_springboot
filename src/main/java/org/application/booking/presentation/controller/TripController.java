// ✅ TripController.java
package org.application.booking.presentation.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.application.booking.application.feature.trip.AddTripRequest;
import org.application.booking.application.feature.trip.AddTripUseCase;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.domain.aggregates.TripModel.TimeFrame;
import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.repository.BusRepository;
import org.application.booking.repository.TripRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/trip")
@RequiredArgsConstructor
public class TripController {

    private final AddTripUseCase addTripUseCase;
    private final TripRepository tripRepository;
    private final BusRepository busRepository;


    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips() {
        List<Trip> trips = tripRepository.findAll();
        return ResponseEntity.ok(trips);
    }


    @PostMapping
    public ResponseEntity<String> addTrip(@RequestBody @Valid AddTripRequest request) {
        addTripUseCase.addTrip(request);
        return ResponseEntity.ok("Trip created successfully.");
    }


    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable UUID id) {
        Optional<Trip> trip = tripRepository.findById(id);
        return trip.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTrip(@PathVariable UUID id) {
        if (!tripRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        tripRepository.deleteById(id);
        return ResponseEntity.ok("Trip deleted successfully.");
    }


    @PutMapping("/{id}")
    public ResponseEntity<String> updateTrip(@PathVariable UUID id, @RequestBody @Valid AddTripRequest request) {
        Optional<Trip> optionalTrip = tripRepository.findById(id);
        if (optionalTrip.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Trip trip = optionalTrip.get();

        Optional<Bus> bus = busRepository.findById(request.getBusId());
        if (bus.isEmpty()) {
            return ResponseEntity.badRequest().body("Bus not found");
        }

        trip.setDeparture(request.getDeparture());
        trip.setDestination(request.getDestination());
        trip.setPricePerSeat(request.getPrice());
        trip.setTimeFrame(request.getTimeFrame());
        trip.setBus(bus.get());

        tripRepository.save(trip);

        return ResponseEntity.ok("Trip updated successfully.");
    }
}
