package com.dkpm.bus_booking_api.features.trip;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dkpm.bus_booking_api.domain.booking.Booking;
import com.dkpm.bus_booking_api.domain.booking.BookingDetail;
import com.dkpm.bus_booking_api.domain.booking.BookingRepository;
import com.dkpm.bus_booking_api.domain.booking.BookingStatus;
import com.dkpm.bus_booking_api.domain.bus.Bus;
import com.dkpm.bus_booking_api.domain.bus.BusRepository;
import com.dkpm.bus_booking_api.domain.bus.Seat;
import com.dkpm.bus_booking_api.domain.exception.ResourceNotFoundException;
import com.dkpm.bus_booking_api.domain.route.Route;
import com.dkpm.bus_booking_api.domain.route.RouteRepository;
import com.dkpm.bus_booking_api.domain.trip.SeatStatus;
import com.dkpm.bus_booking_api.domain.trip.Trip;
import com.dkpm.bus_booking_api.domain.trip.TripRepository;
import com.dkpm.bus_booking_api.domain.trip.TripSeat;
import com.dkpm.bus_booking_api.domain.trip.TripSeatRepository;
import com.dkpm.bus_booking_api.domain.trip.TripStatus;
import com.dkpm.bus_booking_api.features.trip.dto.CreateTripRequest;
import com.dkpm.bus_booking_api.features.trip.dto.TripDetailResponse;
import com.dkpm.bus_booking_api.features.trip.dto.TripSearchResponse;
import com.dkpm.bus_booking_api.features.trip.dto.UpdateTripRequest;
import com.dkpm.bus_booking_api.infrastructure.email.IEmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class TripService implements ITripService {

    private final TripRepository tripRepository;
    private final TripSeatRepository tripSeatRepository;
    private final RouteRepository routeRepository;
    private final BusRepository busRepository;
    private final BookingRepository bookingRepository;
    private final IEmailService emailService;

    @Override
    public Page<TripSearchResponse> adminSearchTrips(
            TripStatus status,
            UUID routeId,
            UUID busId,
            LocalDate fromDate,
            LocalDate toDate,
            String routeCode,
            String busLicensePlate,
            Pageable pageable) {

        LocalDateTime fromDateTime = fromDate != null ? fromDate.atStartOfDay() : null;
        LocalDateTime toDateTime = toDate != null ? toDate.plusDays(1).atStartOfDay() : null;

        return tripRepository.adminSearchTrips(
                status, routeId, busId, fromDateTime, toDateTime, routeCode, busLicensePlate, pageable)
                .map(TripSearchResponse::from);
    }

    @Override
    public Page<TripSearchResponse> searchTrips(
            UUID departureStationId,
            UUID arrivalStationId,
            LocalDate departureDate,
            int passengers,
            Pageable pageable) {

        return tripRepository.searchAvailableTrips(
                departureStationId,
                arrivalStationId,
                departureDate,
                passengers,
                pageable).map(TripSearchResponse::from);
    }

    @Override
    public Page<TripSearchResponse> searchTripsByProvince(
            String departureProvince,
            String arrivalProvince,
            LocalDate departureDate,
            int passengers,
            Pageable pageable) {

        return tripRepository.searchTripsByProvince(
                departureProvince,
                arrivalProvince,
                departureDate,
                passengers,
                pageable).map(TripSearchResponse::from);
    }

    @Override
    public TripDetailResponse getTripDetail(UUID tripId) {
        Trip trip = tripRepository.findByIdWithDetails(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        List<TripSeat> tripSeats = tripSeatRepository.findByTripId(tripId);

        return TripDetailResponse.from(trip, tripSeats);
    }

    @Override
    public Page<TripSearchResponse> getUpcomingTrips(Pageable pageable) {
        return tripRepository.findUpcomingTrips(LocalDateTime.now(), pageable)
                .map(TripSearchResponse::from);
    }

    @Override
    @Transactional
    public TripDetailResponse createTrip(CreateTripRequest request) {
        // Validate route exists
        Route route = routeRepository.findByIdWithStations(request.routeId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + request.routeId()));

        // Validate bus exists
        Bus bus = busRepository.findById(request.busId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + request.busId()));

        // Validate times
        if (request.arrivalTime().isBefore(request.departureTime())) {
            throw new IllegalArgumentException("Arrival time must be after departure time");
        }

        // Check for scheduling conflicts
        if (tripRepository.hasSchedulingConflict(
                request.busId(),
                request.departureTime(),
                request.arrivalTime(),
                UUID.randomUUID())) { // Use random UUID to not exclude any trip
            throw new IllegalArgumentException("Bus has a scheduling conflict during this time period");
        }

        // Create trip
        Trip trip = Trip.builder()
                .route(route)
                .bus(bus)
                .departureTime(request.departureTime())
                .arrivalTime(request.arrivalTime())
                .price(request.price())
                .status(TripStatus.SCHEDULED)
                .totalSeats(bus.getTotalSeats())
                .availableSeats(bus.getTotalSeats())
                .build();

        trip = tripRepository.save(trip);

        // Create trip seats based on bus seat layout
        createTripSeatsFromBus(trip, bus);

        List<TripSeat> tripSeats = tripSeatRepository.findByTripId(trip.getId());

        return TripDetailResponse.from(trip, tripSeats);
    }

    /**
     * Create TripSeat entries based on bus seat layout
     */
    private void createTripSeatsFromBus(Trip trip, Bus bus) {
        if (bus.getSeatLayout() == null || bus.getSeatLayout().getSeats() == null) {
            throw new IllegalStateException("Bus does not have a seat layout configured");
        }

        List<TripSeat> tripSeats = bus.getSeatLayout().getSeats().stream()
                .filter(Seat::isActive)
                .map(seat -> TripSeat.builder()
                        .trip(trip)
                        .seatId(seat.getSeatId())
                        .row(seat.getRow())
                        .col(seat.getCol())
                        .status(SeatStatus.AVAILABLE)
                        .build())
                .toList();

        tripSeatRepository.saveAll(tripSeats);
    }

    @Override
    @Transactional
    public TripDetailResponse updateTrip(UUID tripId, UpdateTripRequest request) {
        Trip trip = tripRepository.findByIdWithDetails(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        // Only allow updates for SCHEDULED trips
        if (trip.getStatus() != TripStatus.SCHEDULED) {
            throw new IllegalStateException("Cannot update trip with status: " + trip.getStatus());
        }

        if (request.departureTime() != null) {
            trip.setDepartureTime(request.departureTime());
        }
        if (request.arrivalTime() != null) {
            trip.setArrivalTime(request.arrivalTime());
        }

        // Validate times after potential updates
        if (trip.getArrivalTime().isBefore(trip.getDepartureTime())) {
            throw new IllegalArgumentException("Arrival time must be after departure time");
        }

        if (request.price() != null) {
            trip.setPrice(request.price());
        }
        if (request.status() != null) {
            trip.setStatus(request.status());
        }

        trip = tripRepository.save(trip);
        List<TripSeat> tripSeats = tripSeatRepository.findByTripId(tripId);

        return TripDetailResponse.from(trip, tripSeats);
    }

    @Override
    @Transactional
    public void cancelTrip(UUID tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        if (trip.getStatus() == TripStatus.COMPLETED || trip.getStatus() == TripStatus.CANCELLED) {
            throw new IllegalStateException("Cannot cancel trip with status: " + trip.getStatus());
        }

        // Handle existing bookings
        List<Booking> activeBookings = bookingRepository.findActiveBookingsByTripId(tripId);

        for (Booking booking : activeBookings) {
            // Release seats for each booking
            for (BookingDetail detail : booking.getDetails()) {
                TripSeat tripSeat = detail.getTripSeat();
                tripSeat.release();
                tripSeatRepository.save(tripSeat);
            }

            // Update booking status to CANCELLED
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);

            // Send notification email to passenger
            emailService.sendTripCancellationNotification(booking);
        }

        // Update trip status
        trip.setStatus(TripStatus.CANCELLED);
        tripRepository.save(trip);

        log.info("Cancelled trip {} with {} affected bookings", tripId, activeBookings.size());
    }

    @Override
    @Transactional
    public void deleteTrip(UUID tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        // Only allow deletion of SCHEDULED trips with no bookings
        if (trip.getStatus() != TripStatus.SCHEDULED) {
            throw new IllegalStateException("Can only delete SCHEDULED trips");
        }

        // Check if there are any booked seats
        int bookedSeats = trip.getTotalSeats() - trip.getAvailableSeats();
        if (bookedSeats > 0) {
            throw new IllegalStateException("Cannot delete trip with existing bookings");
        }

        trip.setDeleted(true);
        tripRepository.save(trip);
    }
}
