package com.dkpm.bus_booking_api.features.booking;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.dkpm.bus_booking_api.domain.booking.Booking;
import com.dkpm.bus_booking_api.domain.booking.BookingDetail;
import com.dkpm.bus_booking_api.domain.booking.BookingRepository;
import com.dkpm.bus_booking_api.domain.booking.BookingStatus;
import com.dkpm.bus_booking_api.domain.exception.ResourceNotFoundException;
import com.dkpm.bus_booking_api.domain.security.Account;
import com.dkpm.bus_booking_api.domain.security.AccountRepository;
import com.dkpm.bus_booking_api.domain.trip.SeatStatus;
import com.dkpm.bus_booking_api.domain.trip.Trip;
import com.dkpm.bus_booking_api.domain.trip.TripRepository;
import com.dkpm.bus_booking_api.domain.trip.TripSeat;
import com.dkpm.bus_booking_api.domain.trip.TripSeatRepository;
import com.dkpm.bus_booking_api.features.booking.dto.BookingResponse;
import com.dkpm.bus_booking_api.features.booking.dto.CreateBookingRequest;
import com.dkpm.bus_booking_api.infrastructure.email.IEmailService;
import com.dkpm.bus_booking_api.test.TestDataFactory;

@ExtendWith(MockitoExtension.class)
@DisplayName("BookingService Unit Tests")
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private TripRepository tripRepository;

    @Mock
    private TripSeatRepository tripSeatRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private IEmailService emailService;

    @InjectMocks
    private BookingService bookingService;

    private Trip testTrip;
    private TripSeat testSeat;
    private Booking testBooking;

    @BeforeEach
    void setUp() {
        testTrip = TestDataFactory.createTrip();
        testSeat = TestDataFactory.createTripSeat(testTrip, "A01");
        testBooking = TestDataFactory.createBooking(testTrip);
    }

    @Test
    @DisplayName("createBooking - success reserves seats")
    void createBooking_success_reservesSeats() {
        // Given
        CreateBookingRequest request = new CreateBookingRequest(
                testTrip.getId(), List.of("A01"),
                "Test Passenger", "0901234567", "test@example.com", null);

        when(tripRepository.findByIdWithDetails(testTrip.getId())).thenReturn(Optional.of(testTrip));
        when(tripSeatRepository.findAndLockByTripIdAndSeatIds(testTrip.getId(), List.of("A01")))
                .thenReturn(List.of(testSeat));
        when(bookingRepository.existsByBookingCode(any())).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking saved = invocation.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });
        when(tripRepository.save(any(Trip.class))).thenReturn(testTrip);

        // When
        BookingResponse response = bookingService.createBooking(request, null);

        // Then
        assertThat(response).isNotNull();
        assertThat(testSeat.getStatus()).isEqualTo(SeatStatus.RESERVED);
        verify(emailService).sendBookingConfirmation(any(Booking.class));
    }

    @Test
    @DisplayName("createBooking - seat not available throws exception")
    void createBooking_seatNotAvailable_throwsException() {
        // Given
        testSeat.setStatus(SeatStatus.BOOKED);

        CreateBookingRequest request = new CreateBookingRequest(
                testTrip.getId(), List.of("A01"),
                "Test Passenger", "0901234567", "test@example.com", null);

        when(tripRepository.findByIdWithDetails(testTrip.getId())).thenReturn(Optional.of(testTrip));
        when(tripSeatRepository.findAndLockByTripIdAndSeatIds(testTrip.getId(), List.of("A01")))
                .thenReturn(List.of(testSeat));

        // When/Then
        assertThatThrownBy(() -> bookingService.createBooking(request, null))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not available");
    }

    @Test
    @DisplayName("createBooking - trip departed throws exception")
    void createBooking_tripDeparted_throwsException() {
        // Given
        testTrip.setDepartureTime(LocalDateTime.now().minusHours(1));

        CreateBookingRequest request = new CreateBookingRequest(
                testTrip.getId(), List.of("A01"),
                "Test Passenger", "0901234567", "test@example.com", null);

        when(tripRepository.findByIdWithDetails(testTrip.getId())).thenReturn(Optional.of(testTrip));

        // When/Then
        assertThatThrownBy(() -> bookingService.createBooking(request, null))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already departed");
    }

    @Test
    @DisplayName("cancelBooking - releases seats")
    void cancelBooking_releasesSeats() {
        // Given
        testSeat.setStatus(SeatStatus.RESERVED);
        BookingDetail detail = TestDataFactory.createBookingDetail(testBooking, testSeat);
        testBooking.getDetails().add(detail);

        when(bookingRepository.findByIdWithDetails(testBooking.getId())).thenReturn(Optional.of(testBooking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);
        when(tripRepository.save(any(Trip.class))).thenReturn(testTrip);

        // When
        BookingResponse response = bookingService.cancelBooking(testBooking.getId(), null);

        // Then
        assertThat(response).isNotNull();
        assertThat(testBooking.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        assertThat(testSeat.getStatus()).isEqualTo(SeatStatus.AVAILABLE);
        verify(emailService).sendBookingCancellation(any(Booking.class));
    }

    @Test
    @DisplayName("cancelBooking - unauthorized throws exception")
    void cancelBooking_unauthorized_throwsException() {
        // Given
        Account customer = new Account();
        customer.setId(UUID.randomUUID());
        testBooking.setCustomer(customer);

        UUID differentUserId = UUID.randomUUID();

        when(bookingRepository.findByIdWithDetails(testBooking.getId())).thenReturn(Optional.of(testBooking));

        // When/Then
        assertThatThrownBy(() -> bookingService.cancelBooking(testBooking.getId(), differentUserId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Not authorized");
    }

    @Test
    @DisplayName("confirmBooking - updates seats to booked")
    void confirmBooking_updatesSeatsToBooked() {
        // Given
        testSeat.setStatus(SeatStatus.RESERVED);
        BookingDetail detail = TestDataFactory.createBookingDetail(testBooking, testSeat);
        testBooking.getDetails().add(detail);

        when(bookingRepository.findByIdWithDetails(testBooking.getId())).thenReturn(Optional.of(testBooking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        // When
        BookingResponse response = bookingService.confirmBooking(testBooking.getId());

        // Then
        assertThat(response).isNotNull();
        assertThat(testBooking.getStatus()).isEqualTo(BookingStatus.CONFIRMED);
        assertThat(testSeat.getStatus()).isEqualTo(SeatStatus.BOOKED);
    }

    @Test
    @DisplayName("processExpiredBookings - expires and releases seats")
    void processExpiredBookings_expiresAndReleasesSeats() {
        // Given
        testBooking.setExpiryTime(LocalDateTime.now().minusMinutes(1));
        testSeat.setStatus(SeatStatus.RESERVED);
        BookingDetail detail = TestDataFactory.createBookingDetail(testBooking, testSeat);
        testBooking.getDetails().add(detail);

        when(bookingRepository.findExpiredPendingBookings(any())).thenReturn(List.of(testBooking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);
        when(tripRepository.save(any(Trip.class))).thenReturn(testTrip);

        // When
        bookingService.processExpiredBookings();

        // Then
        assertThat(testBooking.getStatus()).isEqualTo(BookingStatus.EXPIRED);
        assertThat(testSeat.getStatus()).isEqualTo(SeatStatus.AVAILABLE);
    }

    @Test
    @DisplayName("getBookingById - not found throws exception")
    void getBookingById_notFound_throwsException() {
        // Given
        UUID id = UUID.randomUUID();
        when(bookingRepository.findByIdWithDetails(id)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> bookingService.getBookingById(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
