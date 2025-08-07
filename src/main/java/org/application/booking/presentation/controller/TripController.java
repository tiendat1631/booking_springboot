package org.application.booking.presentation.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.application.booking.application.feature.trip.AddTripRequest;
import org.application.booking.application.feature.trip.TripService;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.presentation.ApiResponse;
import org.application.booking.presentation.DTO.SearchTripRequest;
import org.application.booking.repository.TripRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/trip")
public class TripController {
    private final TripService tripService;

    @GetMapping("/{tripId}")
    public ResponseEntity<ApiResponse<Trip>> getTrip(@PathVariable UUID tripId) {
        Trip trip = tripService.getTrip(tripId);
        ApiResponse<Trip> response = ApiResponse.success("Trip fetched successfully", trip);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Trip>>> getTrips(@ModelAttribute SearchTripRequest request) {
        List<Trip> trips = tripService.getTrips(request);
        ApiResponse<List<Trip>> response = ApiResponse.success("Trips fetched successfully", trips);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> addTrip(@RequestBody @Valid AddTripRequest addTripRequest) {
        tripService.addTrip(addTripRequest);
        ApiResponse<Object> response = ApiResponse.success("Trip created successfully", null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<ApiResponse<Object>> deleteTrip(@PathVariable UUID tripId) {
        tripService.deleteTrip(tripId);
        ApiResponse<Object> response = ApiResponse.success("Trip deleted successfully", null);
        return ResponseEntity.ok(response);
    }

}
