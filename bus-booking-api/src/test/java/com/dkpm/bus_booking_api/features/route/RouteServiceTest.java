// package com.dkpm.bus_booking_api.features.route;

// import static org.assertj.core.api.Assertions.assertThat;
// import static org.assertj.core.api.Assertions.assertThatThrownBy;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.verify;
// import static org.mockito.Mockito.when;

// import java.math.BigDecimal;
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
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageImpl;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Pageable;

// import com.dkpm.bus_booking_api.domain.exception.ResourceNotFoundException;
// import com.dkpm.bus_booking_api.domain.route.Route;
// import com.dkpm.bus_booking_api.domain.route.RouteRepository;
// import com.dkpm.bus_booking_api.domain.station.Station;
// import com.dkpm.bus_booking_api.domain.station.StationRepository;
// import com.dkpm.bus_booking_api.features.route.dto.CreateRouteRequest;
// import com.dkpm.bus_booking_api.features.route.dto.RouteResponse;
// import com.dkpm.bus_booking_api.test.TestDataFactory;

// @ExtendWith(MockitoExtension.class)
// @DisplayName("RouteService Unit Tests")
// class RouteServiceTest {

// @Mock
// private RouteRepository routeRepository;

// @Mock
// private StationRepository stationRepository;

// @InjectMocks
// private RouteService routeService;

// private Station departureStation;
// private Station arrivalStation;
// private Route testRoute;

// @BeforeEach
// void setUp() {
// departureStation = TestDataFactory.createStation("Departure", "DEP");
// arrivalStation = TestDataFactory.createStation("Arrival", "ARR");
// testRoute = TestDataFactory.createRoute(departureStation, arrivalStation);
// }

// @Test
// @DisplayName("createRoute - success")
// void createRoute_success() {
// // Given
// CreateRouteRequest request = new CreateRouteRequest(
// "Test Route", "RT001",
// departureStation.getId(), arrivalStation.getId(),
// 300, 360, new BigDecimal("350000"), "Test description");

// when(routeRepository.existsByCode("RT001")).thenReturn(false);
// when(stationRepository.findById(departureStation.getId())).thenReturn(Optional.of(departureStation));
// when(stationRepository.findById(arrivalStation.getId())).thenReturn(Optional.of(arrivalStation));
// when(routeRepository.save(any(Route.class))).thenAnswer(invocation -> {
// Route saved = invocation.getArgument(0);
// saved.setId(UUID.randomUUID());
// return saved;
// });

// // When
// RouteResponse response = routeService.createRoute(request);

// // Then
// assertThat(response).isNotNull();
// assertThat(response.name()).isEqualTo("Test Route");
// verify(routeRepository).save(any(Route.class));
// }

// @Test
// @DisplayName("createRoute - same stations throws exception")
// void createRoute_sameStations_throwsException() {
// // Given
// CreateRouteRequest request = new CreateRouteRequest(
// "Test Route", "RT001",
// departureStation.getId(), departureStation.getId(),
// 300, 360, new BigDecimal("350000"), "Test description");

// when(routeRepository.existsByCode("RT001")).thenReturn(false);

// // When/Then
// assertThatThrownBy(() -> routeService.createRoute(request))
// .isInstanceOf(IllegalArgumentException.class)
// .hasMessageContaining("must be different");
// }

// @Test
// @DisplayName("createRoute - station not found throws exception")
// void createRoute_stationNotFound_throwsException() {
// // Given
// CreateRouteRequest request = new CreateRouteRequest(
// "Test Route", "RT001",
// departureStation.getId(), arrivalStation.getId(),
// 300, 360, new BigDecimal("350000"), "Test description");

// when(routeRepository.existsByCode("RT001")).thenReturn(false);
// when(stationRepository.findById(departureStation.getId())).thenReturn(Optional.empty());

// // When/Then
// assertThatThrownBy(() -> routeService.createRoute(request))
// .isInstanceOf(ResourceNotFoundException.class)
// .hasMessageContaining("not found");
// }

// @Test
// @DisplayName("getRouteById - success")
// void getRouteById_success() {
// // Given
// when(routeRepository.findByIdWithStations(testRoute.getId())).thenReturn(Optional.of(testRoute));

// // When
// RouteResponse response = routeService.getRouteById(testRoute.getId());

// // Then
// assertThat(response).isNotNull();
// assertThat(response.departureStation()).isNotNull();
// assertThat(response.arrivalStation()).isNotNull();
// }

// @Test
// @DisplayName("searchRoutes - returns filtered results")
// void searchRoutes_withKeyword_returnsFilteredResults() {
// // Given
// Pageable pageable = PageRequest.of(0, 10);
// Page<Route> routePage = new PageImpl<>(List.of(testRoute));
// when(routeRepository.searchRoutes("test", pageable)).thenReturn(routePage);

// // When
// Page<RouteResponse> response = routeService.searchRoutes("test", pageable);

// // Then
// assertThat(response).isNotEmpty();
// assertThat(response.getContent()).hasSize(1);
// }

// @Test
// @DisplayName("deleteRoute - soft deletes")
// void deleteRoute_softDeletes() {
// // Given
// when(routeRepository.findById(testRoute.getId())).thenReturn(Optional.of(testRoute));
// when(routeRepository.save(any(Route.class))).thenReturn(testRoute);

// // When
// routeService.deleteRoute(testRoute.getId());

// // Then
// verify(routeRepository).save(any(Route.class));
// assertThat(testRoute.isDeleted()).isTrue();
// }
// }
