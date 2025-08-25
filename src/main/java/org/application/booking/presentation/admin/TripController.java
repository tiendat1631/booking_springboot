package org.application.booking.presentation.admin;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.application.booking.application.feature.trip.TripService;
import org.application.booking.application.feature.trip.request.AddTripRequest;
import org.application.booking.presentation.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController("AdminTripController")
@AllArgsConstructor
@RequestMapping("/api/trip")
@PreAuthorize("hasRole('ADMIN')")
public class TripController {
    private final TripService tripService;

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
