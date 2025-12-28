package com.dkpm.bus_booking_api.features.trip;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dkpm.bus_booking_api.features.trip.dto.CreateTripRequest;
import com.dkpm.bus_booking_api.features.trip.dto.TripDetailResponse;
import com.dkpm.bus_booking_api.features.trip.dto.TripSearchResponse;
import com.dkpm.bus_booking_api.features.trip.dto.UpdateTripRequest;

import com.dkpm.bus_booking_api.domain.trip.TripStatus;

public interface ITripService {

        /**
         * Admin search trips with flexible filters
         */
        Page<TripSearchResponse> adminSearchTrips(
                        TripStatus status,
                        UUID routeId,
                        UUID busId,
                        LocalDate fromDate,
                        LocalDate toDate,
                        String routeCode,
                        String busLicensePlate,
                        Pageable pageable);

        /**
         * Search for available trips
         */
        Page<TripSearchResponse> searchTrips(
                        UUID departureStationId,
                        UUID arrivalStationId,
                        LocalDate departureDate,
                        int passengers,
                        Pageable pageable);

        /**
         * Search trips by province codename
         */
        Page<TripSearchResponse> searchTripsByProvince(
                        String departureProvince,
                        String arrivalProvince,
                        LocalDate departureDate,
                        int passengers,
                        Pageable pageable);

        /**
         * Get trip details with seat availability
         */
        TripDetailResponse getTripDetail(UUID tripId);

        /**
         * Get upcoming trips (admin dashboard)
         */
        Page<TripSearchResponse> getUpcomingTrips(Pageable pageable);

        /**
         * Create a new trip
         */
        TripDetailResponse createTrip(CreateTripRequest request);

        /**
         * Update trip details
         */
        TripDetailResponse updateTrip(UUID tripId, UpdateTripRequest request);

        /**
         * Cancel a trip
         */
        void cancelTrip(UUID tripId);

        /**
         * Delete a trip (soft delete)
         */
        void deleteTrip(UUID tripId);
}
