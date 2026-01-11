// package com.dkpm.bus_booking_api.features.trip;

// import static org.assertj.core.api.Assertions.assertThat;
// import static org.assertj.core.api.Assertions.assertThatThrownBy;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.verify;
// import static org.mockito.Mockito.when;

// import java.math.BigDecimal;
// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Optional;
// import java.util.UUID;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.ArgumentCaptor;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageImpl;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Pageable;

// import com.dkpm.bus_booking_api.domain.bus.Bus;
// import com.dkpm.bus_booking_api.domain.bus.BusRepository;
// import com.dkpm.bus_booking_api.domain.route.Route;
// import com.dkpm.bus_booking_api.domain.route.RouteRepository;
// import com.dkpm.bus_booking_api.domain.trip.Trip;
// import com.dkpm.bus_booking_api.domain.trip.TripRepository;
// import com.dkpm.bus_booking_api.domain.trip.TripSeat;
// import com.dkpm.bus_booking_api.domain.trip.TripSeatRepository;
// import com.dkpm.bus_booking_api.domain.trip.TripStatus;
// import com.dkpm.bus_booking_api.features.trip.dto.CreateTripRequest;
// import com.dkpm.bus_booking_api.features.trip.dto.TripDetailResponse;
// import com.dkpm.bus_booking_api.features.trip.dto.TripSearchResponse;
// import com.dkpm.bus_booking_api.domain.booking.BookingRepository;
// import com.dkpm.bus_booking_api.infrastructure.email.IEmailService;
// import com.dkpm.bus_booking_api.test.TestDataFactory;

// @ExtendWith(MockitoExtension.class)
// @DisplayName("TripService Unit Tests")
// class TripServiceTest {

// @Mock
// private TripRepository tripRepository;

// @Mock
// private TripSeatRepository tripSeatRepository;

// @Mock
// private RouteRepository routeRepository;

// @Mock
// private BusRepository busRepository;

// @Mock
// private BookingRepository bookingRepository;

// @Mock
// private IEmailService emailService;

// @InjectMocks
// private TripService tripService;

// private Route testRoute;
// private Bus testBus;
// private Trip testTrip;

// @BeforeEach
// void setUp() {
// testRoute = TestDataFactory.createRoute();
// testBus = TestDataFactory.createBus();
// testTrip = TestDataFactory.createTrip(testRoute, testBus);
// }

// @Test
// @DisplayName("createTrip - success creates seats")
// void createTrip_success_createsSeats() {
// // Given
// LocalDateTime departure = LocalDateTime.now().plusDays(1);
// LocalDateTime arrival = departure.plusHours(6);

// CreateTripRequest request = new CreateTripRequest(
// testRoute.getId(), testBus.getId(),
// departure, arrival, new BigDecimal("350000"));

// when(routeRepository.findByIdWithStations(testRoute.getId())).thenReturn(Optional.of(testRoute));
// when(busRepository.findById(testBus.getId())).thenReturn(Optional.of(testBus));
// when(tripRepository.hasSchedulingConflict(any(), any(), any(),
// any())).thenReturn(false);
// when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> {
// Trip saved = invocation.getArgument(0);
// saved.setId(UUID.randomUUID());
// return saved;
// });
// when(tripSeatRepository.saveAll(any())).thenReturn(List.of());
// when(tripSeatRepository.findByTripId(any())).thenReturn(List.of());

// // When
// TripDetailResponse response = tripService.createTrip(request);

// // Then
// assertThat(response).isNotNull();
// verify(tripRepository).save(any(Trip.class));
// verify(tripSeatRepository).saveAll(any());
// }

// @Test
// @DisplayName("createTrip - scheduling conflict throws exception")
// void createTrip_schedulingConflict_throwsException() {
// // Given
// LocalDateTime departure = LocalDateTime.now().plusDays(1);
// LocalDateTime arrival = departure.plusHours(6);

// CreateTripRequest request = new CreateTripRequest(
// testRoute.getId(), testBus.getId(),
// departure, arrival, new BigDecimal("350000"));

// when(routeRepository.findByIdWithStations(testRoute.getId())).thenReturn(Optional.of(testRoute));
// when(busRepository.findById(testBus.getId())).thenReturn(Optional.of(testBus));
// when(tripRepository.hasSchedulingConflict(any(), any(), any(),
// any())).thenReturn(true);

// // When/Then
// assertThatThrownBy(() -> tripService.createTrip(request))
// .isInstanceOf(IllegalArgumentException.class)
// .hasMessageContaining("scheduling conflict");
// }

// @Test
// @DisplayName("createTrip - invalid times throws exception")
// void createTrip_invalidTimes_throwsException() {
// // Given
// LocalDateTime departure = LocalDateTime.now().plusDays(1);
// LocalDateTime arrival = departure.minusHours(1); // arrival before departure

// CreateTripRequest request = new CreateTripRequest(
// testRoute.getId(), testBus.getId(),
// departure, arrival, new BigDecimal("350000"));

// when(routeRepository.findByIdWithStations(testRoute.getId())).thenReturn(Optional.of(testRoute));
// when(busRepository.findById(testBus.getId())).thenReturn(Optional.of(testBus));

// // When/Then
// assertThatThrownBy(() -> tripService.createTrip(request))
// .isInstanceOf(IllegalArgumentException.class)
// .hasMessageContaining("after departure");
// }

// @Test
// @DisplayName("searchTrips - returns available trips")
// void searchTrips_returnsAvailableTrips() {
// // Given
// UUID departureStationId = testRoute.getDepartureStation().getId();
// UUID arrivalStationId = testRoute.getArrivalStation().getId();
// LocalDate date = LocalDate.now().plusDays(1);
// Pageable pageable = PageRequest.of(0, 10);

// Page<Trip> tripPage = new PageImpl<>(List.of(testTrip));
// when(tripRepository.searchAvailableTrips(departureStationId,
// arrivalStationId, date, 1, pageable))
// .thenReturn(tripPage);

// // When
// Page<TripSearchResponse> response = tripService.searchTrips(
// departureStationId, arrivalStationId, date, 1, pageable);

// // Then
// assertThat(response).isNotEmpty();
// assertThat(response.getContent()).hasSize(1);
// }

// @Test
// @DisplayName("getTripDetail - returns trip with seats")
// void getTripDetail_returnsTripWithSeats() {
// // Given
// TripSeat tripSeat = TestDataFactory.createTripSeat(testTrip, "A01");
// when(tripRepository.findByIdWithDetails(testTrip.getId())).thenReturn(Optional.of(testTrip));
// when(tripSeatRepository.findByTripId(testTrip.getId())).thenReturn(List.of(tripSeat));

// // When
// TripDetailResponse response = tripService.getTripDetail(testTrip.getId());

// // Then
// assertThat(response).isNotNull();
// assertThat(response.seats()).hasSize(1);
// }

// @Test
// @DisplayName("cancelTrip - updates status")
// void cancelTrip_updatesStatus() {
// // Given - Trip starts with SCHEDULED status
// assertThat(testTrip.getStatus()).isEqualTo(TripStatus.SCHEDULED);

// when(tripRepository.findById(testTrip.getId())).thenReturn(Optional.of(testTrip));
// when(bookingRepository.findActiveBookingsByTripId(testTrip.getId())).thenReturn(List.of());
// when(tripRepository.save(any(Trip.class))).thenAnswer(invocation ->
// invocation.getArgument(0));

// // When
// tripService.cancelTrip(testTrip.getId());

// // Then - Verify save was called and trip status changed to CANCELLED
// ArgumentCaptor<Trip> tripCaptor = ArgumentCaptor.forClass(Trip.class);
// verify(tripRepository).save(tripCaptor.capture());

// Trip savedTrip = tripCaptor.getValue();
// assertThat(savedTrip.getStatus()).isEqualTo(TripStatus.CANCELLED);
// assertThat(savedTrip.getId()).isEqualTo(testTrip.getId());
// }

// @Test
// @DisplayName("cancelTrip - already completed throws exception")
// void cancelTrip_alreadyCompleted_throwsException() {
// // Given
// testTrip.setStatus(TripStatus.COMPLETED);
// when(tripRepository.findById(testTrip.getId())).thenReturn(Optional.of(testTrip));

// // When/Then
// assertThatThrownBy(() -> tripService.cancelTrip(testTrip.getId()))
// .isInstanceOf(IllegalStateException.class)
// .hasMessageContaining("Cannot cancel");
// }
// }
