package org.application.booking.presentation.guest.controller;

import lombok.AllArgsConstructor;
import org.application.booking.application.feature.trip.request.SearchTripRequest;
import org.application.booking.application.feature.trip.response.TripCardResponse;
import org.application.booking.application.feature.trip.TripService;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.presentation.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController("PublicTripController")
@AllArgsConstructor
@RequestMapping("/api/trip")
public class TripController {
    private final TripService tripService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TripCardResponse>>> getTrips(@ModelAttribute SearchTripRequest request) {
        List<TripCardResponse> trips = tripService.getTrips(request);
        ApiResponse<List<TripCardResponse>> response = ApiResponse.success("Trips fetched successfully", trips);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<ApiResponse<Trip>> getTrip(@PathVariable UUID tripId) {
        Trip trip = tripService.getTrip(tripId);
        ApiResponse<Trip> response = ApiResponse.success("Trip fetched successfully", trip);
        return ResponseEntity.ok(response);
    }
}
