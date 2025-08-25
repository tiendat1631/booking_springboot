package org.application.booking.controller.admin;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.application.booking.controller.ApiResponse;
import org.application.booking.controller.dto.AddTripRequest;
import org.application.booking.service.trip.TripService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController("AdminTripController")
@AllArgsConstructor
@RequestMapping("/api/v1/trip")
@PreAuthorize("hasRole('ADMIN')")
public class TripController {
    private final TripService tripService;

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> addTrip(@RequestBody @Valid AddTripRequest addTripRequest) {
        tripService.addTrip(addTripRequest);
        ApiResponse<Object> response = ApiResponse.success("Trip created successfully", null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // TODO: Need to handle constraint
    @DeleteMapping("/{tripId}")
    public ResponseEntity<ApiResponse<Object>> deleteTrip(@PathVariable UUID tripId) {
        tripService.deleteTrip(tripId);
        ApiResponse<Object> response = ApiResponse.success("Trip deleted successfully", null);
        return ResponseEntity.ok(response);
    }
}
