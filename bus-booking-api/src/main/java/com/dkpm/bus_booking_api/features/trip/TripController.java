package com.dkpm.bus_booking_api.features.trip;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dkpm.bus_booking_api.application.response.ApiResponse;
import com.dkpm.bus_booking_api.features.trip.dto.CreateTripRequest;
import com.dkpm.bus_booking_api.features.trip.dto.TripDetailResponse;
import com.dkpm.bus_booking_api.features.trip.dto.TripResponse;
import com.dkpm.bus_booking_api.features.trip.dto.UpdateTripRequest;

import com.dkpm.bus_booking_api.domain.bus.BusType;
import com.dkpm.bus_booking_api.domain.trip.TripStatus;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final ITripService tripService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<TripResponse>>> getTrips(
            @RequestParam(required = false) List<TripStatus> status,
            @RequestParam(required = false) List<BusType> busType,
            @RequestParam(required = false) String routeCode,
            @RequestParam(required = false) String busLicensePlate,
            @RequestParam(required = false) String departureStation,
            @RequestParam(required = false) String arrivalStation,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(size = 10, sort = "departureTime", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<TripResponse> result = tripService.adminSearchTrips(
                status, busType, routeCode, busLicensePlate, departureStation, arrivalStation, fromDate, toDate,
                pageable);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<TripResponse>>> searchTripsByProvince(
            @RequestParam String departureProvince,
            @RequestParam String arrivalProvince,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
            @RequestParam(defaultValue = "1") int passengers,
            @PageableDefault(size = 10, sort = "departureTime", direction = Sort.Direction.ASC) Pageable pageable) {

        Page<TripResponse> result = tripService.searchTripsByProvince(
                departureProvince,
                arrivalProvince,
                departureDate,
                passengers,
                pageable);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<ApiResponse<TripDetailResponse>> getTripDetail(@PathVariable UUID tripId) {
        TripDetailResponse trip = tripService.getTripDetail(tripId);
        return ResponseEntity.ok(ApiResponse.success(trip));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TripDetailResponse>> createTrip(@Valid @RequestBody CreateTripRequest request) {
        TripDetailResponse trip = tripService.createTrip(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(trip, "Trip created successfully"));
    }

    @PutMapping("/{tripId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TripDetailResponse>> updateTrip(
            @PathVariable UUID tripId,
            @Valid @RequestBody UpdateTripRequest request) {
        TripDetailResponse trip = tripService.updateTrip(tripId, request);
        return ResponseEntity.ok(ApiResponse.success(trip, "Trip updated successfully"));
    }

    @PostMapping("/{tripId}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> cancelTrip(@PathVariable UUID tripId) {
        tripService.cancelTrip(tripId);
        return ResponseEntity.ok(ApiResponse.success("Trip cancelled successfully"));
    }

    @DeleteMapping("/{tripId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTrip(@PathVariable UUID tripId) {
        tripService.deleteTrip(tripId);
        return ResponseEntity.ok(ApiResponse.success("Trip deleted successfully"));
    }
}
