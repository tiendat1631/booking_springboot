package org.application.booking.presentation.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.application.booking.application.feature.trip.AddTripRequest;
import org.application.booking.application.feature.trip.AddTripUseCase;
import org.application.booking.application.feature.trip.DeleteTripUseCase;
import org.application.booking.application.query.TripQueryService;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.presentation.DTO.SearchTripRequest;
import org.application.booking.presentation.DTO.TripInfoResponse;
import org.application.booking.repository.TripRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/trip")
public class TripController {
    private final AddTripUseCase addTripUseCase;
    private final TripRepository tripRepository;
    private final TripQueryService tripQueryService;
    private final DeleteTripUseCase deleteTripUseCase;

    @PostMapping
    public void addTrip (@RequestBody @Valid AddTripRequest addTripRequest) {
        this.addTripUseCase.addTrip(addTripRequest);
    }

    @GetMapping
    public List<Trip> getTrips(@ModelAttribute SearchTripRequest request) {
        List<Trip> trips = tripRepository.findAll(request.toSpecification());
        return trips;
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<String> deleteTrip(@PathVariable UUID tripId) {
        deleteTripUseCase.deleteTrip(tripId);
        return ResponseEntity.ok("Trip deleted successfully");
    }

    @PostMapping("/search")
    public ResponseEntity<List<TripInfoResponse>> searchTrips(@RequestBody SearchTripRequest request) {
        List<TripInfoResponse> result = tripQueryService.searchTrips(request);
        return ResponseEntity.ok(result);
    }
}
