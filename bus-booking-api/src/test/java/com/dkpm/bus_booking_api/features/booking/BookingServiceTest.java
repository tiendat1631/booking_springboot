// package com.dkpm.bus_booking_api.features.booking;

// import static org.assertj.core.api.Assertions.assertThat;
// import static org.assertj.core.api.Assertions.assertThatThrownBy;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.verify;
// import static org.mockito.Mockito.when;

// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Optional;
// import java.util.UUID;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;

// import com.dkpm.bus_booking_api.domain.booking.Booking;
// import com.dkpm.bus_booking_api.domain.booking.BookingDetail;
// import com.dkpm.bus_booking_api.domain.booking.BookingRepository;
// import com.dkpm.bus_booking_api.domain.booking.BookingStatus;
// import com.dkpm.bus_booking_api.domain.exception.ResourceNotFoundException;
// import com.dkpm.bus_booking_api.domain.security.Account;
// import com.dkpm.bus_booking_api.domain.security.AccountRepository;
// import com.dkpm.bus_booking_api.domain.trip.SeatStatus;
// import com.dkpm.bus_booking_api.domain.trip.Trip;
// import com.dkpm.bus_booking_api.domain.trip.TripRepository;
// import com.dkpm.bus_booking_api.domain.trip.TripSeat;
// import com.dkpm.bus_booking_api.domain.trip.TripSeatRepository;
// import com.dkpm.bus_booking_api.features.booking.dto.BookingResponse;
// import com.dkpm.bus_booking_api.features.booking.dto.CreateBookingRequest;
// import com.dkpm.bus_booking_api.infrastructure.email.IEmailService;
// import com.dkpm.bus_booking_api.test.TestDataFactory;

// @ExtendWith(MockitoExtension.class)
// @DisplayName("BookingService Unit Tests")
// class BookingServiceTest {

// @Mock
// private BookingRepository bookingRepository;

// @Mock
// private TripRepository tripRepository;

// @Mock
// private TripSeatRepository tripSeatRepository;

// @Mock
// private AccountRepository accountRepository;

// @Mock
// private IEmailService emailService;

// @InjectMocks
// private BookingService bookingService;

// private Trip testTrip;
// private TripSeat testSeat;
// private Booking testBooking;

// @BeforeEach
// void setUp() {
// testTrip = TestDataFactory.createTrip();
// testSeat = TestDataFactory.createTripSeat(testTrip, "A01");
// testBooking = TestDataFactory.createBooking(testTrip);
// }

// @Test
// @DisplayName("createBooking - success reserves seats")
// void createBooking_success_reservesSeats() {
// // Given
// CreateBookingRequest request = new CreateBookingRequest(
// testTrip.getId(), List.of("A01"),
// "Test Passenger", "0901234567", "test@example.com", null);

// when(tripRepository.findByIdWithDetails(testTrip.getId())).thenReturn(Optional.of(testTrip));
// when(tripSeatRepository.findAndLockByTripIdAndSeatIds(testTrip.getId(),
// List.of("A01")))
// .thenReturn(List.of(testSeat));
// when(bookingRepository.existsByBookingCode(any())).thenReturn(false);
// when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
// Booking saved = invocation.getArgument(0);
// saved.setId(UUID.randomUUID());
// return saved;
// });
// when(tripRepository.save(any(Trip.class))).thenReturn(testTrip);

// // When
// BookingResponse response = bookingService.createBooking(request, null);

// // Then
// assertThat(response).isNotNull();
// assertThat(testSeat.getStatus()).isEqualTo(SeatStatus.RESERVED);
// verify(emailService).sendBookingConfirmation(any(Booking.class));
// }

// @Test
// @DisplayName("createBooking - seat not available throws exception")
// void createBooking_seatNotAvailable_throwsException() {
// // Given
// testSeat.setStatus(SeatStatus.BOOKED);

// CreateBookingRequest request = new CreateBookingRequest(
// testTrip.getId(), List.of("A01"),
// "Test Passenger", "0901234567", "test@example.com", null);

// when(tripRepository.findByIdWithDetails(testTrip.getId())).thenReturn(Optional.of(testTrip));
// when(tripSeatRepository.findAndLockByTripIdAndSeatIds(testTrip.getId(),
// List.of("A01")))
// .thenReturn(List.of(testSeat));

// // When/Then
// assertThatThrownBy(() -> bookingService.createBooking(request, null))
// .isInstanceOf(IllegalStateException.class)
// .hasMessageContaining("not available");
// }

// @Test
// @DisplayName("createBooking - trip departed throws exception")
// void createBooking_tripDeparted_throwsException() {
// // Given
// testTrip.setDepartureTime(LocalDateTime.now().minusHours(1));

// CreateBookingRequest request = new CreateBookingRequest(
// testTrip.getId(), List.of("A01"),
// "Test Passenger", "0901234567", "test@example.com", null);

// when(tripRepository.findByIdWithDetails(testTrip.getId())).thenReturn(Optional.of(testTrip));

// // When/Then
// assertThatThrownBy(() -> bookingService.createBooking(request, null))
// .isInstanceOf(IllegalStateException.class)
// .hasMessageContaining("already departed");
// }

// @Test
// @DisplayName("cancelBooking - unauthorized throws exception")
// void cancelBooking_unauthorized_throwsException() {
// // Given
// Account customer = new Account();
// customer.setId(UUID.randomUUID());
// testBooking.setCustomer(customer);

// UUID differentUserId = UUID.randomUUID();
// Account differentUser = new Account();
// differentUser.setId(differentUserId);
// differentUser.setRole(com.dkpm.bus_booking_api.domain.security.Role.CUSTOMER);

// when(bookingRepository.findByIdWithDetails(testBooking.getId())).thenReturn(Optional.of(testBooking));
// when(accountRepository.findById(differentUserId)).thenReturn(Optional.of(differentUser));

// // When/Then
// assertThatThrownBy(() -> bookingService.cancelBooking(testBooking.getId(),
// differentUserId))
// .isInstanceOf(IllegalArgumentException.class)
// .hasMessageContaining("Not authorized");
// }

// @Test
// @DisplayName("confirmBooking - updates seats to booked")
// void confirmBooking_updatesSeatsToBooked() {
// // Given
// testSeat.setStatus(SeatStatus.RESERVED);
// BookingDetail detail = TestDataFactory.createBookingDetail(testBooking,
// testSeat);
// testBooking.getDetails().add(detail);

// when(bookingRepository.findByIdWithDetails(testBooking.getId())).thenReturn(Optional.of(testBooking));
// when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

// // When
// BookingResponse response =
// bookingService.confirmBooking(testBooking.getId());

// // Then
// assertThat(response).isNotNull();
// assertThat(testBooking.getStatus()).isEqualTo(BookingStatus.CONFIRMED);
// assertThat(testSeat.getStatus()).isEqualTo(SeatStatus.BOOKED);
// }

// @Test
// @DisplayName("processExpiredBookings - expires and releases seats")
// void processExpiredBookings_expiresAndReleasesSeats() {
// // Given
// testBooking.setExpiryTime(LocalDateTime.now().minusMinutes(1));
// testSeat.setStatus(SeatStatus.RESERVED);
// BookingDetail detail = TestDataFactory.createBookingDetail(testBooking,
// testSeat);
// testBooking.getDetails().add(detail);

// when(bookingRepository.findExpiredPendingBookings(any())).thenReturn(List.of(testBooking));
// when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);
// when(tripRepository.save(any(Trip.class))).thenReturn(testTrip);

// // When
// bookingService.processExpiredBookings();

// // Then
// assertThat(testBooking.getStatus()).isEqualTo(BookingStatus.EXPIRED);
// assertThat(testSeat.getStatus()).isEqualTo(SeatStatus.AVAILABLE);
// }

// @Test
// @DisplayName("getBookingById - not found throws exception")
// void getBookingById_notFound_throwsException() {
// // Given
// UUID id = UUID.randomUUID();
// when(bookingRepository.findByIdWithDetails(id)).thenReturn(Optional.empty());

// // When/Then
// assertThatThrownBy(() -> bookingService.getBookingById(id))
// .isInstanceOf(ResourceNotFoundException.class);
// }

// @Test
// @DisplayName("createBooking - concurrent booking same seat - second request
// fails")
// void createBooking_concurrentBookingSameSeat_secondRequestFails() throws
// Exception {
// // Given - Two users trying to book the same seat
// String targetSeatId = "A01";

// // Create requests for both users
// CreateBookingRequest request1 = new CreateBookingRequest(
// testTrip.getId(), List.of(targetSeatId),
// "User 1", "0901234567", "user1@example.com", null);

// CreateBookingRequest request2 = new CreateBookingRequest(
// testTrip.getId(), List.of(targetSeatId),
// "User 2", "0907654321", "user2@example.com", null);

// // Create a fresh seat for first request (AVAILABLE)
// TripSeat availableSeat = TestDataFactory.createTripSeat(testTrip,
// targetSeatId);
// availableSeat.setStatus(SeatStatus.AVAILABLE);

// // Create a reserved seat for second request (simulating first booking
// // succeeded)
// TripSeat reservedSeat = TestDataFactory.createTripSeat(testTrip,
// targetSeatId);
// reservedSeat.setStatus(SeatStatus.RESERVED);

// // Setup mocks for first booking (success)
// when(tripRepository.findByIdWithDetails(testTrip.getId())).thenReturn(Optional.of(testTrip));
// when(bookingRepository.existsByBookingCode(any())).thenReturn(false);
// when(tripRepository.save(any(Trip.class))).thenReturn(testTrip);

// // First call returns available seat, second call returns reserved seat
// when(tripSeatRepository.findAndLockByTripIdAndSeatIds(testTrip.getId(),
// List.of(targetSeatId)))
// .thenReturn(List.of(availableSeat)) // First call - seat is available
// .thenReturn(List.of(reservedSeat)); // Second call - seat already reserved

// when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
// Booking saved = invocation.getArgument(0);
// saved.setId(UUID.randomUUID());
// return saved;
// });

// // When - First user books successfully
// BookingResponse response1 = bookingService.createBooking(request1, null);

// // Then - First booking succeeds
// assertThat(response1).isNotNull();
// assertThat(availableSeat.getStatus()).isEqualTo(SeatStatus.RESERVED);

// // When/Then - Second user fails because seat is already reserved
// assertThatThrownBy(() -> bookingService.createBooking(request2, null))
// .isInstanceOf(IllegalStateException.class)
// .hasMessageContaining("not available");
// }

// @Test
// @DisplayName("createBooking - concurrent booking different seats - both
// succeed")
// void createBooking_concurrentBookingDifferentSeats_bothSucceed() {
// // Given - Two users booking different seats
// TripSeat seat1 = TestDataFactory.createTripSeat(testTrip, "A01");
// TripSeat seat2 = TestDataFactory.createTripSeat(testTrip, "A02");

// CreateBookingRequest request1 = new CreateBookingRequest(
// testTrip.getId(), List.of("A01"),
// "User 1", "0901234567", "user1@example.com", null);

// CreateBookingRequest request2 = new CreateBookingRequest(
// testTrip.getId(), List.of("A02"),
// "User 2", "0907654321", "user2@example.com", null);

// // Setup mocks
// when(tripRepository.findByIdWithDetails(testTrip.getId())).thenReturn(Optional.of(testTrip));
// when(tripSeatRepository.findAndLockByTripIdAndSeatIds(testTrip.getId(),
// List.of("A01")))
// .thenReturn(List.of(seat1));
// when(tripSeatRepository.findAndLockByTripIdAndSeatIds(testTrip.getId(),
// List.of("A02")))
// .thenReturn(List.of(seat2));
// when(bookingRepository.existsByBookingCode(any())).thenReturn(false);
// when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
// Booking saved = invocation.getArgument(0);
// saved.setId(UUID.randomUUID());
// return saved;
// });
// when(tripRepository.save(any(Trip.class))).thenReturn(testTrip);

// // When - Both users book
// BookingResponse response1 = bookingService.createBooking(request1, null);
// BookingResponse response2 = bookingService.createBooking(request2, null);

// // Then - Both succeed
// assertThat(response1).isNotNull();
// assertThat(response2).isNotNull();
// assertThat(seat1.getStatus()).isEqualTo(SeatStatus.RESERVED);
// assertThat(seat2.getStatus()).isEqualTo(SeatStatus.RESERVED);
// }

// @Test
// @DisplayName("createBooking - partial seat overlap - fails when any seat
// unavailable")
// void createBooking_partialSeatOverlap_failsWhenAnySeatUnavailable() {
// // Given - User 1 books A01, A02. User 2 tries to book A02, A03
// TripSeat seatA01 = TestDataFactory.createTripSeat(testTrip, "A01");
// TripSeat seatA02 = TestDataFactory.createTripSeat(testTrip, "A02");
// TripSeat seatA03 = TestDataFactory.createTripSeat(testTrip, "A03");

// // User 1 request
// CreateBookingRequest request1 = new CreateBookingRequest(
// testTrip.getId(), List.of("A01", "A02"),
// "User 1", "0901234567", "user1@example.com", null);

// // User 2 request - overlaps on A02
// CreateBookingRequest request2 = new CreateBookingRequest(
// testTrip.getId(), List.of("A02", "A03"),
// "User 2", "0907654321", "user2@example.com", null);

// // Setup for first booking
// when(tripRepository.findByIdWithDetails(testTrip.getId())).thenReturn(Optional.of(testTrip));
// when(tripSeatRepository.findAndLockByTripIdAndSeatIds(testTrip.getId(),
// List.of("A01", "A02")))
// .thenReturn(List.of(seatA01, seatA02));
// when(bookingRepository.existsByBookingCode(any())).thenReturn(false);
// when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
// Booking saved = invocation.getArgument(0);
// saved.setId(UUID.randomUUID());
// return saved;
// });
// when(tripRepository.save(any(Trip.class))).thenReturn(testTrip);

// // When - First user books successfully
// BookingResponse response1 = bookingService.createBooking(request1, null);
// assertThat(response1).isNotNull();

// // Now seat A02 is RESERVED
// assertThat(seatA02.getStatus()).isEqualTo(SeatStatus.RESERVED);

// // Setup for second booking - A02 is already reserved
// when(tripSeatRepository.findAndLockByTripIdAndSeatIds(testTrip.getId(),
// List.of("A02", "A03")))
// .thenReturn(List.of(seatA02, seatA03)); // A02 is now RESERVED

// // When/Then - Second user fails because A02 is not available
// assertThatThrownBy(() -> bookingService.createBooking(request2, null))
// .isInstanceOf(IllegalStateException.class)
// .hasMessageContaining("not available");

// // Verify A03 was not reserved (atomicity - all or nothing)
// assertThat(seatA03.getStatus()).isEqualTo(SeatStatus.AVAILABLE);
// }
// }
