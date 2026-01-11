package com.dkpm.bus_booking_api.infrastructure.seeding;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.dkpm.bus_booking_api.domain.bus.Bus;
import com.dkpm.bus_booking_api.domain.bus.BusRepository;
import com.dkpm.bus_booking_api.domain.bus.BusStatus;
import com.dkpm.bus_booking_api.domain.bus.BusType;
import com.dkpm.bus_booking_api.domain.bus.Seat;
import com.dkpm.bus_booking_api.domain.bus.SeatLayout;
import com.dkpm.bus_booking_api.domain.route.Route;
import com.dkpm.bus_booking_api.domain.route.RouteRepository;
import com.dkpm.bus_booking_api.domain.station.Province;
import com.dkpm.bus_booking_api.domain.station.Station;
import com.dkpm.bus_booking_api.domain.station.StationRepository;
import com.dkpm.bus_booking_api.domain.trip.SeatStatus;
import com.dkpm.bus_booking_api.domain.trip.Ticket;
import com.dkpm.bus_booking_api.domain.trip.Trip;
import com.dkpm.bus_booking_api.domain.trip.TripRepository;
import com.dkpm.bus_booking_api.domain.trip.TripStatus;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Data seeder for development/demo purposes.
 * Run with profile "dev" or "demo" to seed data.
 * Seeds Stations, Bus, Route and Trips for January 24-26, 2026.
 */
@Configuration
@Slf4j
@RequiredArgsConstructor
public class DataSeeder {

        private final RouteRepository routeRepository;
        private final BusRepository busRepository;
        private final StationRepository stationRepository;
        private final TripRepository tripRepository;

        @Bean
        @Profile({ "dev", "demo" })
        CommandLineRunner seedData() {
                return args -> {
                        log.info("=== Starting DataSeeder ===");

                        // 1. Seed Stations
                        Station hanoiStation = seedStation(
                                        "Bến xe Mỹ Đình",
                                        "20 Phạm Hùng, Mỹ Đình, Nam Từ Liêm, Hà Nội",
                                        Province.builder().code(1).name("Thành phố Hà Nội").codename("thanh_pho_ha_noi")
                                                        .build(),
                                        21.0285, 105.7823);

                        Station hcmStation = seedStation(
                                        "Bến xe Miền Đông Mới",
                                        "292 Đinh Bộ Lĩnh, Phường 26, Bình Thạnh, TP.HCM",
                                        Province.builder().code(79).name("Thành phố Hồ Chí Minh")
                                                        .codename("thanh_pho_ho_chi_minh").build(),
                                        10.8142, 106.7110);

                        // 2. Seed Bus
                        Bus bus = seedBus("51B-12345", BusType.SLEEPER, 34);

                        // 3. Seed Route
                        Route route = seedRoute(
                                        "HN-HCM",
                                        "Hà Nội - Hồ Chí Minh",
                                        Province.builder().code(1).name("Thành phố Hà Nội").codename("thanh_pho_ha_noi")
                                                        .build(),
                                        Province.builder().code(79).name("Thành phố Hồ Chí Minh")
                                                        .codename("thanh_pho_ho_chi_minh").build(),
                                        1700, // 1700 km
                                        1080, // 18 hours
                                        new BigDecimal("450000"));

                        // 4. Seed Trips for January 24-26, 2026
                        seedTrips(route, bus, hanoiStation, hcmStation);

                        log.info("=== DataSeeder completed successfully! ===");
                };
        }

        private Station seedStation(String name, String address, Province province, double lat, double lon) {
                // Check if station already exists
                var existingStations = stationRepository.searchStations(name, java.util.List.of(province.getCodename()),
                                null,
                                org.springframework.data.domain.PageRequest.of(0, 1));
                if (!existingStations.isEmpty()) {
                        log.info("Station already exists: {}", name);
                        return existingStations.getContent().get(0);
                }

                Station station = Station.builder()
                                .name(name)
                                .address(address)
                                .province(province)
                                .latitude(lat)
                                .longitude(lon)
                                .active(true)
                                .build();

                station = stationRepository.save(station);
                log.info("Created station: {}", name);
                return station;
        }

        private Bus seedBus(String licensePlate, BusType type, int seats) {
                // Check if bus already exists
                var existingBuses = busRepository.findAll(org.springframework.data.domain.PageRequest.of(0, 100));
                for (Bus b : existingBuses.getContent()) {
                        if (b.getLicensePlate().equals(licensePlate)) {
                                log.info("Bus already exists: {}", licensePlate);
                                return b;
                        }
                }

                // Create seat layout for sleeper bus (34 seats)
                // Layout: 4 columns x 9 rows = 36 slots, but only 34 seats active
                List<Seat> seatList = new ArrayList<>();
                int seatNumber = 1;

                for (int row = 1; row <= 9; row++) {
                        for (int col = 1; col <= 4; col++) {
                                if (seatNumber <= seats) {
                                        seatList.add(new Seat(
                                                        String.format("S%02d", seatNumber++),
                                                        row,
                                                        col,
                                                        true));
                                }
                        }
                }

                SeatLayout seatLayout = new SeatLayout(4, 9, seatList);

                Bus bus = new Bus();
                bus.setLicensePlate(licensePlate);
                bus.setType(type);
                bus.setStatus(BusStatus.ACTIVE);
                bus.setSeatLayout(seatLayout);

                bus = busRepository.save(bus);
                log.info("Created bus: {} with {} seats", licensePlate, bus.getTotalSeats());
                return bus;
        }

        private Route seedRoute(String code, String name, Province departure, Province destination,
                        int distanceKm, int durationMinutes, BigDecimal basePrice) {
                // Check if route already exists
                if (routeRepository.existsByCode(code)) {
                        log.info("Route already exists: {}", code);
                        return routeRepository.findAllActive().stream()
                                        .filter(r -> r.getCode().equals(code))
                                        .findFirst()
                                        .orElse(null);
                }

                Route route = Route.builder()
                                .code(code)
                                .name(name)
                                .departureProvince(departure)
                                .destinationProvince(destination)
                                .distanceKm(distanceKm)
                                .estimatedDurationMinutes(durationMinutes)
                                .basePrice(basePrice)
                                .active(true)
                                .build();

                route = routeRepository.save(route);
                log.info("Created route: {} ({})", name, code);
                return route;
        }

        private void seedTrips(Route route, Bus bus, Station departureStation, Station arrivalStation) {
                if (route == null || bus == null) {
                        log.warn("Route or Bus is null, skipping trip seeding");
                        return;
                }

                BigDecimal basePrice = route.getBasePrice() != null ? route.getBasePrice() : new BigDecimal("450000");
                int durationMinutes = route.getEstimatedDurationMinutes() != null ? route.getEstimatedDurationMinutes()
                                : 1080;

                // Departure times: 6h, 8h, 10h, 13h, 15h, 18h, 21h
                int[] departureTimes = { 6, 8, 10, 13, 15, 18, 21 };

                // Seed trips for January 24-26, 2026
                for (int day = 24; day <= 26; day++) {
                        for (int hour : departureTimes) {
                                LocalDateTime departureTime = LocalDateTime.of(2026, 1, day, hour, 0);
                                LocalDateTime arrivalTime = departureTime.plusMinutes(durationMinutes);

                                // Check if trip already exists
                                var existingTrips = tripRepository.findByRouteAndDateRange(
                                                route.getId(),
                                                departureTime.minusMinutes(30),
                                                departureTime.plusMinutes(30));
                                if (!existingTrips.isEmpty()) {
                                        log.info("Trip already exists for {} at {}", route.getCode(), departureTime);
                                        continue;
                                }

                                // Create trip
                                Trip trip = Trip.builder()
                                                .route(route)
                                                .bus(bus)
                                                .departureStation(departureStation)
                                                .destinationStation(arrivalStation)
                                                .departureTime(departureTime)
                                                .arrivalTime(arrivalTime)
                                                .price(basePrice)
                                                .status(TripStatus.SCHEDULED)
                                                .totalSeats(bus.getTotalSeats())
                                                .availableSeats(bus.getTotalSeats())
                                                .tickets(new ArrayList<>())
                                                .build();

                                // Create tickets based on bus seat layout
                                if (bus.getSeatLayout() != null && bus.getSeatLayout().getSeats() != null) {
                                        for (Seat seat : bus.getSeatLayout().getSeats()) {
                                                if (seat.isActive()) {
                                                        Ticket ticket = Ticket.builder()
                                                                        .trip(trip)
                                                                        .seatId(seat.getSeatId())
                                                                        .row(seat.getRow())
                                                                        .col(seat.getCol())
                                                                        .status(SeatStatus.AVAILABLE)
                                                                        .price(basePrice)
                                                                        .build();
                                                        trip.getTickets().add(ticket);
                                                }
                                        }
                                }

                                tripRepository.save(trip);
                                log.info("Created trip: {} -> {} on {} at {}:00 with {} seats",
                                                departureStation.getName(),
                                                arrivalStation.getName(),
                                                String.format("2026-01-%02d", day),
                                                hour,
                                                trip.getTickets().size());
                        }
                }
        }
}
