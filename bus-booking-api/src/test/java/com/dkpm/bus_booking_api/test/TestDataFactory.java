package com.dkpm.bus_booking_api.test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.dkpm.bus_booking_api.domain.booking.Booking;
import com.dkpm.bus_booking_api.domain.booking.BookingDetail;
import com.dkpm.bus_booking_api.domain.booking.BookingStatus;
import com.dkpm.bus_booking_api.domain.bus.Bus;
import com.dkpm.bus_booking_api.domain.bus.BusStatus;
import com.dkpm.bus_booking_api.domain.bus.BusType;
import com.dkpm.bus_booking_api.domain.bus.Seat;
import com.dkpm.bus_booking_api.domain.bus.SeatLayout;
import com.dkpm.bus_booking_api.domain.payment.Payment;
import com.dkpm.bus_booking_api.domain.payment.PaymentMethod;
import com.dkpm.bus_booking_api.domain.payment.PaymentStatus;
import com.dkpm.bus_booking_api.domain.route.Route;
import com.dkpm.bus_booking_api.domain.station.Station;
import com.dkpm.bus_booking_api.domain.trip.SeatStatus;
import com.dkpm.bus_booking_api.domain.trip.Trip;
import com.dkpm.bus_booking_api.domain.trip.TripSeat;
import com.dkpm.bus_booking_api.domain.trip.TripStatus;

/**
 * Factory class for creating test entities
 */
public class TestDataFactory {

    public static Station createStation() {
        return createStation("Test Station", "TST");
    }

    public static Station createStation(String name, String code) {
        Station station = new Station();
        station.setId(UUID.randomUUID());
        station.setName(name);
        station.setCode(code);
        station.setAddress("123 Test Street");
        station.setCity("Test City");
        station.setProvince("Test Province");
        station.setActive(true);
        station.setDeleted(false);
        return station;
    }

    public static Route createRoute() {
        Station departure = createStation("Departure Station", "DEP");
        Station arrival = createStation("Arrival Station", "ARR");
        return createRoute(departure, arrival);
    }

    public static Route createRoute(Station departure, Station arrival) {
        Route route = new Route();
        route.setId(UUID.randomUUID());
        route.setName(departure.getName() + " - " + arrival.getName());
        route.setCode("RT001");
        route.setDepartureStation(departure);
        route.setArrivalStation(arrival);
        route.setDistanceKm(300);
        route.setEstimatedDurationMinutes(360);
        route.setBasePrice(new BigDecimal("350000"));
        route.setActive(true);
        route.setDeleted(false);
        return route;
    }

    public static Bus createBus() {
        Bus bus = new Bus();
        bus.setId(UUID.randomUUID());
        bus.setLicensePlate("51B-12345");
        bus.setType(BusType.SLEEPER);
        bus.setStatus(BusStatus.ACTIVE);
        bus.setTotalSeats(40);
        bus.setSeatLayout(createSeatLayout());
        return bus;
    }

    public static SeatLayout createSeatLayout() {
        List<Seat> seats = new ArrayList<>();
        for (int row = 1; row <= 10; row++) {
            for (int col = 1; col <= 4; col++) {
                Seat seat = new Seat();
                seat.setSeatId("A" + String.format("%02d", (row - 1) * 4 + col));
                seat.setRow(row);
                seat.setCol(col);
                seat.setActive(true);
                seats.add(seat);
            }
        }
        SeatLayout layout = new SeatLayout();
        layout.setTotalRows(10);
        layout.setTotalColumns(4);
        layout.setSeats(seats);
        return layout;
    }

    public static Trip createTrip() {
        Route route = createRoute();
        Bus bus = createBus();
        return createTrip(route, bus);
    }

    public static Trip createTrip(Route route, Bus bus) {
        Trip trip = new Trip();
        trip.setId(UUID.randomUUID());
        trip.setRoute(route);
        trip.setBus(bus);
        trip.setDepartureTime(LocalDateTime.now().plusDays(1));
        trip.setArrivalTime(LocalDateTime.now().plusDays(1).plusHours(6));
        trip.setPrice(new BigDecimal("350000"));
        trip.setStatus(TripStatus.SCHEDULED);
        trip.setTotalSeats(40);
        trip.setAvailableSeats(40);
        trip.setTripSeats(new ArrayList<>());
        return trip;
    }

    public static TripSeat createTripSeat(Trip trip, String seatId) {
        TripSeat tripSeat = new TripSeat();
        tripSeat.setId(UUID.randomUUID());
        tripSeat.setTrip(trip);
        tripSeat.setSeatId(seatId);
        tripSeat.setRow(1);
        tripSeat.setCol(1);
        tripSeat.setStatus(SeatStatus.AVAILABLE);
        tripSeat.setDeleted(false);
        return tripSeat;
    }

    public static Booking createBooking(Trip trip) {
        Booking booking = new Booking();
        booking.setId(UUID.randomUUID());
        booking.setBookingCode("BK2024122400001");
        booking.setTrip(trip);
        booking.setPassengerName("Test Passenger");
        booking.setPassengerPhone("0901234567");
        booking.setPassengerEmail("test@example.com");
        booking.setTotalAmount(new BigDecimal("350000"));
        booking.setDiscountAmount(BigDecimal.ZERO);
        booking.setFinalAmount(new BigDecimal("350000"));
        booking.setStatus(BookingStatus.PENDING);
        booking.setBookingTime(LocalDateTime.now());
        booking.setExpiryTime(LocalDateTime.now().plusMinutes(15));
        booking.setDeleted(false);
        booking.setDetails(new ArrayList<>());
        return booking;
    }

    public static BookingDetail createBookingDetail(Booking booking, TripSeat tripSeat) {
        BookingDetail detail = new BookingDetail();
        detail.setId(UUID.randomUUID());
        detail.setBooking(booking);
        detail.setTripSeat(tripSeat);
        detail.setSeatId(tripSeat.getSeatId());
        detail.setSeatPrice(new BigDecimal("350000"));
        return detail;
    }

    public static Payment createPayment(Booking booking) {
        Payment payment = new Payment();
        payment.setId(UUID.randomUUID());
        payment.setBooking(booking);
        payment.setMethod(PaymentMethod.VNPAY);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setAmount(booking.getFinalAmount());
        payment.setVnpayTxnRef("202412241234560001");
        return payment;
    }
}
