package org.application.booking.controller.guest;

import lombok.RequiredArgsConstructor;
import org.application.booking.controller.ApiResponse;
import org.application.booking.controller.dto.SearchTripRequest;
import org.application.booking.controller.dto.TripCardResponse;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.service.trip.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController("PublicTripController")
@RequiredArgsConstructor
@RequestMapping("/api/v1/trip")
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
