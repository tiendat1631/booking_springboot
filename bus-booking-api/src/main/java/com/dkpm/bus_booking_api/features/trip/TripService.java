package com.dkpm.bus_booking_api.features.trip;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
import com.dkpm.bus_booking_api.domain.bus.BusType;
import com.dkpm.bus_booking_api.domain.bus.Seat;

import com.dkpm.bus_booking_api.domain.exception.ResourceNotFoundException;
import com.dkpm.bus_booking_api.domain.route.Route;
import com.dkpm.bus_booking_api.domain.route.RouteRepository;
import com.dkpm.bus_booking_api.domain.station.Station;
import com.dkpm.bus_booking_api.domain.station.StationRepository;
import com.dkpm.bus_booking_api.domain.trip.SeatStatus;
import com.dkpm.bus_booking_api.domain.trip.Ticket;
import com.dkpm.bus_booking_api.domain.trip.TicketRepository;
import com.dkpm.bus_booking_api.domain.trip.Trip;
import com.dkpm.bus_booking_api.domain.trip.TripRepository;
import com.dkpm.bus_booking_api.domain.trip.TripStatus;
import com.dkpm.bus_booking_api.features.trip.dto.CreateTripRequest;
import com.dkpm.bus_booking_api.features.trip.dto.TripDetailResponse;
import com.dkpm.bus_booking_api.features.trip.dto.TripResponse;
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
    private final TicketRepository ticketRepository;
    private final RouteRepository routeRepository;
    private final BusRepository busRepository;
    private final StationRepository stationRepository;
    private final BookingRepository bookingRepository;
    private final IEmailService emailService;

    @Override
    public Page<TripResponse> adminSearchTrips(
            List<TripStatus> statuses,
            List<BusType> busTypes,
            String routeCode,
            String busLicensePlate,
            String departureStation,
            String destinationStation,
            LocalDate fromDate,
            LocalDate toDate,
            Pageable pageable) {

        LocalDateTime fromDateTime = fromDate != null ? fromDate.atStartOfDay() : null;
        LocalDateTime toDateTime = toDate != null ? toDate.plusDays(1).atStartOfDay() : null;

        return tripRepository.adminSearchTrips(
                statuses, busTypes, routeCode, busLicensePlate, departureStation, destinationStation, fromDateTime,
                toDateTime,
                pageable)
                .map(TripResponse::from);
    }

    @Override
    public Page<TripResponse> searchTrips(
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
                pageable).map(TripResponse::from);
    }

    @Override
    public Page<TripResponse> searchTripsByProvince(
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
                pageable).map(TripResponse::from);
    }

    @Override
    public TripDetailResponse getTripDetail(UUID tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        List<Ticket> tickets = ticketRepository.findByTripId(tripId);

        return TripDetailResponse.from(trip, tickets);
    }

    @Override
    public Page<TripResponse> getUpcomingTrips(Pageable pageable) {
        return tripRepository.findUpcomingTrips(LocalDateTime.now(), pageable)
                .map(TripResponse::from);
    }

    @Override
    @Transactional
    public TripDetailResponse createTrip(CreateTripRequest request) {
        // Validate input
        validateTripTimes(request.departureTime(), request.arrivalTime());

        // Get and validate entities
        Bus bus = getActiveBus(request.busId());
        Station departureStation = getActiveStation(request.departureStationId(), "Departure");
        Station destinationStation = getActiveStation(request.destinationStationId(), "Destination");
        Route route = getActiveRoute(departureStation, destinationStation);

        // Check scheduling
        validateNoSchedulingConflict(request.busId(), request.departureTime(), request.arrivalTime());

        // Create and save trip
        Trip trip = Trip.builder()
                .route(route)
                .bus(bus)
                .departureStation(departureStation)
                .destinationStation(destinationStation)
                .departureTime(request.departureTime())
                .arrivalTime(request.arrivalTime())
                .price(request.price())
                .status(TripStatus.SCHEDULED)
                .totalSeats(bus.getTotalSeats())
                .availableSeats(bus.getTotalSeats())
                .build();
        trip = tripRepository.save(trip);

        // Create tickets
        createTicketsFromBus(trip, bus, request.price());

        List<Ticket> tickets = ticketRepository.findByTripId(trip.getId());
        return TripDetailResponse.from(trip, tickets);
    }

    @Override
    @Transactional
    public TripDetailResponse updateTrip(UUID tripId, UpdateTripRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        // Only allow updates for SCHEDULED trips
        if (trip.getStatus() != TripStatus.SCHEDULED) {
            throw new IllegalStateException("Cannot update trip with status: " + trip.getStatus());
        }

        // Track if times are being changed for conflict check
        boolean timesChanged = false;

        if (request.departureTime() != null) {
            trip.setDepartureTime(request.departureTime());
            timesChanged = true;
        }
        if (request.arrivalTime() != null) {
            trip.setArrivalTime(request.arrivalTime());
            timesChanged = true;
        }

        // Validate times after potential updates
        validateTripTimes(trip.getDepartureTime(), trip.getArrivalTime());

        // Check scheduling conflicts if times changed
        if (timesChanged) {
            validateNoSchedulingConflictForUpdate(
                    trip.getBus().getId(),
                    trip.getDepartureTime(),
                    trip.getArrivalTime(),
                    tripId);
        }

        if (request.price() != null) {
            trip.setPrice(request.price());
        }
        if (request.status() != null) {
            trip.setStatus(request.status());
        }

        trip = tripRepository.save(trip);
        List<Ticket> tickets = ticketRepository.findByTripId(tripId);

        return TripDetailResponse.from(trip, tickets);
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
        List<Ticket> ticketsToUpdate = new ArrayList<>();
        List<Booking> bookingsToUpdate = new ArrayList<>();

        for (Booking booking : activeBookings) {
            // Release seats for each booking
            for (BookingDetail detail : booking.getDetails()) {
                Ticket ticket = detail.getTicket();
                ticket.release();
                ticketsToUpdate.add(ticket);
            }

            // Update booking status to CANCELLED
            booking.setStatus(BookingStatus.CANCELLED);
            bookingsToUpdate.add(booking);

            // Send notification email to passenger
            emailService.sendTripCancellationNotification(booking);
        }

        ticketRepository.saveAll(ticketsToUpdate);
        bookingRepository.saveAll(bookingsToUpdate);

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

    // ==================== VALIDATION HELPERS ====================

    private void validateTripTimes(LocalDateTime departureTime, LocalDateTime destinationTime) {
        if (departureTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Departure time must be in the future");
        }
        if (destinationTime.isBefore(departureTime)) {
            throw new IllegalArgumentException("Destination time must be after departure time");
        }
    }

    private Bus getActiveBus(UUID busId) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + busId));

        if (!bus.isActive()) {
            throw new IllegalArgumentException("Bus is not active with id: " + busId);
        }
        return bus;
    }

    private Station getActiveStation(UUID stationId, String stationType) {
        return stationRepository.findById(stationId)
                .filter(Station::isActive)
                .orElseThrow(() -> new ResourceNotFoundException(
                        stationType + " station not found or inactive with id: " + stationId));
    }

    private Route getActiveRoute(Station departureStation, Station arrivalStation) {
        Route route = routeRepository.findByProvinces(
                departureStation.getProvince().getCodename(),
                arrivalStation.getProvince().getCodename())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No route found between " + departureStation.getProvince().getName()
                                + " and " + arrivalStation.getProvince().getName()));

        if (!route.isActive()) {
            throw new IllegalArgumentException("The route is currently suspended");
        }
        return route;
    }

    private void validateNoSchedulingConflict(UUID busId, LocalDateTime departureTime, LocalDateTime destinationTime) {
        if (tripRepository.hasSchedulingConflict(busId, departureTime, destinationTime)) {
            throw new IllegalArgumentException("Bus has a scheduling conflict during this time period");
        }
    }

    private void validateNoSchedulingConflictForUpdate(UUID busId, LocalDateTime departureTime,
            LocalDateTime arrivalTime, UUID excludeTripId) {
        if (tripRepository.hasSchedulingConflictExcluding(busId, departureTime, arrivalTime, excludeTripId)) {
            throw new IllegalArgumentException("Bus has a scheduling conflict during this time period");
        }
    }

    private void createTicketsFromBus(Trip trip, Bus bus, BigDecimal basePrice) {
        if (bus.getSeatLayout() == null || bus.getSeatLayout().getSeats() == null) {
            throw new IllegalStateException("Bus does not have a seat layout configured");
        }

        List<Ticket> tickets = bus.getSeatLayout().getSeats().stream()
                .filter(Seat::isActive)
                .map(seat -> Ticket.builder()
                        .trip(trip)
                        .seatId(seat.getSeatId())
                        .row(seat.getRow())
                        .col(seat.getCol())
                        .status(SeatStatus.AVAILABLE)
                        .price(basePrice)
                        .build())
                .toList();

        ticketRepository.saveAll(tickets);
    }

}
