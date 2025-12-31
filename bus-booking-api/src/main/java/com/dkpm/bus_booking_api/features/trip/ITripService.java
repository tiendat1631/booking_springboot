package com.dkpm.bus_booking_api.features.trip;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dkpm.bus_booking_api.features.trip.dto.CreateTripRequest;
import com.dkpm.bus_booking_api.features.trip.dto.TripDetailResponse;
import com.dkpm.bus_booking_api.features.trip.dto.TripResponse;
import com.dkpm.bus_booking_api.features.trip.dto.UpdateTripRequest;

import com.dkpm.bus_booking_api.domain.bus.BusType;
import com.dkpm.bus_booking_api.domain.trip.TripStatus;

public interface ITripService {

        /**
         * Admin search trips with flexible filters
         */
        Page<TripResponse> adminSearchTrips(
                        List<TripStatus> statuses,
                        List<BusType> busTypes,
                        String routeCode,
                        String busLicensePlate,
                        String departureStation,
                        String arrivalStation,
                        LocalDate fromDate,
                        LocalDate toDate,
                        Pageable pageable);

        /**
         * Search for available trips
         */
        Page<TripResponse> searchTrips(
                        UUID departureStationId,
                        UUID arrivalStationId,
                        LocalDate departureDate,
                        int passengers,
                        Pageable pageable);

        /**
         * Search trips by province codename
         */
        Page<TripResponse> searchTripsByProvince(
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
        Page<TripResponse> getUpcomingTrips(Pageable pageable);

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
