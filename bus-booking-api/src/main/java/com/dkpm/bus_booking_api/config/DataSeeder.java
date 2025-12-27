package com.dkpm.bus_booking_api.config;

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
import com.dkpm.bus_booking_api.domain.station.Station;
import com.dkpm.bus_booking_api.domain.station.StationRepository;
import com.dkpm.bus_booking_api.domain.trip.SeatStatus;
import com.dkpm.bus_booking_api.domain.trip.Trip;
import com.dkpm.bus_booking_api.domain.trip.TripRepository;
import com.dkpm.bus_booking_api.domain.trip.TripSeat;
import com.dkpm.bus_booking_api.domain.trip.TripSeatRepository;
import com.dkpm.bus_booking_api.domain.trip.TripStatus;

import lombok.extern.slf4j.Slf4j;

/**
 * Data seeder for development/demo purposes.
 * Run with profile "dev" or "demo" to seed data.
 */
@Configuration
@Slf4j
public class DataSeeder {

        @Bean
        @Profile({ "dev", "demo" })
        CommandLineRunner seedData(
                        StationRepository stationRepository,
                        RouteRepository routeRepository,
                        BusRepository busRepository,
                        TripRepository tripRepository,
                        TripSeatRepository tripSeatRepository) {

                return args -> {
                        // Skip if data already exists
                        if (stationRepository.count() > 0) {
                                log.info("Data already seeded, skipping...");
                                return;
                        }

                        log.info("Seeding sample data...");

                        // ========== STATIONS ==========
                        Station saigonStation = createStation("Bến xe Miền Đông Mới", "MDMOI",
                                        "292 Đinh Bộ Lĩnh, P.26", "Hồ Chí Minh", "Hồ Chí Minh",
                                        10.8231, 106.6297);
                        Station dalatStation = createStation("Bến xe Đà Lạt", "DALAT",
                                        "01 Tô Hiến Thành", "Đà Lạt", "Lâm Đồng",
                                        11.9404, 108.4583);
                        Station nhatrangStation = createStation("Bến xe phía Bắc Nha Trang", "NTBAC",
                                        "58 đường 23/10", "Nha Trang", "Khánh Hòa",
                                        12.2388, 109.1967);
                        Station vungtauStation = createStation("Bến xe Vũng Tàu", "VTAU",
                                        "192 Nam Kỳ Khởi Nghĩa", "Vũng Tàu", "Bà Rịa - Vũng Tàu",
                                        10.3460, 107.0843);
                        Station canthoStation = createStation("Bến xe Cần Thơ", "CTHO",
                                        "91B Nguyễn Văn Linh", "Ninh Kiều", "Cần Thơ",
                                        10.0452, 105.7469);
                        Station hanoiStation = createStation("Bến xe Nước Ngầm", "NNGAM",
                                        "Giáp Bát", "Hà Nội", "Hà Nội",
                                        20.9802, 105.8401);

                        List<Station> stations = stationRepository.saveAll(List.of(
                                        saigonStation, dalatStation, nhatrangStation,
                                        vungtauStation, canthoStation, hanoiStation));
                        log.info("Created {} stations", stations.size());

                        // ========== ROUTES ==========
                        Route sgDalatRoute = createRoute("Sài Gòn - Đà Lạt", "SG-DL",
                                        saigonStation, dalatStation, 305, 420, new BigDecimal("280000"));
                        Route sgNhatrangRoute = createRoute("Sài Gòn - Nha Trang", "SG-NT",
                                        saigonStation, nhatrangStation, 450, 540, new BigDecimal("350000"));
                        Route sgVungtauRoute = createRoute("Sài Gòn - Vũng Tàu", "SG-VT",
                                        saigonStation, vungtauStation, 125, 150, new BigDecimal("120000"));
                        Route sgCanthoRoute = createRoute("Sài Gòn - Cần Thơ", "SG-CT",
                                        saigonStation, canthoStation, 170, 210, new BigDecimal("150000"));
                        Route dalatNhatrangRoute = createRoute("Đà Lạt - Nha Trang", "DL-NT",
                                        dalatStation, nhatrangStation, 140, 180, new BigDecimal("150000"));

                        List<Route> routes = routeRepository.saveAll(List.of(
                                        sgDalatRoute, sgNhatrangRoute, sgVungtauRoute,
                                        sgCanthoRoute, dalatNhatrangRoute));
                        log.info("Created {} routes", routes.size());

                        // ========== BUSES ==========
                        Bus sleeperBus1 = createBus("51B-12345", BusType.SLEEPER, 40);
                        Bus sleeperBus2 = createBus("51B-67890", BusType.SLEEPER, 40);
                        Bus seaterBus1 = createBus("51B-11111", BusType.SEATER, 45);
                        Bus limousineBus = createBus("51B-99999", BusType.LIMOUSINE, 22);

                        List<Bus> buses = busRepository.saveAll(List.of(
                                        sleeperBus1, sleeperBus2, seaterBus1, limousineBus));
                        log.info("Created {} buses", buses.size());

                        // ========== TRIPS ==========
                        LocalDateTime now = LocalDateTime.now();

                        // Tomorrow trips
                        Trip trip1 = createTrip(sgDalatRoute, sleeperBus1,
                                        now.plusDays(1).withHour(22).withMinute(0),
                                        now.plusDays(2).withHour(5).withMinute(0),
                                        new BigDecimal("300000"));
                        Trip trip2 = createTrip(sgDalatRoute, sleeperBus2,
                                        now.plusDays(1).withHour(23).withMinute(0),
                                        now.plusDays(2).withHour(6).withMinute(0),
                                        new BigDecimal("280000"));

                        // Day after tomorrow
                        Trip trip3 = createTrip(sgNhatrangRoute, seaterBus1,
                                        now.plusDays(2).withHour(7).withMinute(0),
                                        now.plusDays(2).withHour(16).withMinute(0),
                                        new BigDecimal("380000"));
                        Trip trip4 = createTrip(sgVungtauRoute, limousineBus,
                                        now.plusDays(2).withHour(8).withMinute(0),
                                        now.plusDays(2).withHour(10).withMinute(30),
                                        new BigDecimal("180000"));

                        // 3 days later
                        Trip trip5 = createTrip(sgCanthoRoute, sleeperBus1,
                                        now.plusDays(3).withHour(6).withMinute(0),
                                        now.plusDays(3).withHour(9).withMinute(30),
                                        new BigDecimal("160000"));

                        List<Trip> trips = tripRepository.saveAll(List.of(
                                        trip1, trip2, trip3, trip4, trip5));
                        log.info("Created {} trips", trips.size());

                        // ========== TRIP SEATS ==========
                        for (Trip trip : trips) {
                                List<TripSeat> tripSeats = createTripSeats(trip);
                                tripSeatRepository.saveAll(tripSeats);
                        }
                        log.info("Created trip seats for all trips");

                        log.info("✅ Sample data seeded successfully!");
                };
        }

        private Station createStation(String name, String code, String address,
                        String city, String province, double lat, double lon) {
                Station station = new Station();
                station.setName(name);
                station.setCode(code);
                station.setAddress(address);
                station.setCity(city);
                station.setProvince(province);
                station.setLatitude(lat);
                station.setLongitude(lon);
                station.setActive(true);
                station.setDeleted(false);
                return station;
        }

        private Route createRoute(String name, String code, Station departure,
                        Station arrival, int distance, int duration, BigDecimal price) {
                Route route = new Route();
                route.setName(name);
                route.setCode(code);
                route.setDepartureStation(departure);
                route.setArrivalStation(arrival);
                route.setDistanceKm(distance);
                route.setEstimatedDurationMinutes(duration);
                route.setBasePrice(price);
                route.setActive(true);
                route.setDeleted(false);
                return route;
        }

        private Bus createBus(String licensePlate, BusType type, int totalSeats) {
                Bus bus = new Bus();
                bus.setLicensePlate(licensePlate);
                bus.setType(type);
                bus.setStatus(BusStatus.ACTIVE);
                bus.setTotalSeats(totalSeats);
                bus.setSeatLayout(createSeatLayout(type, totalSeats));
                return bus;
        }

        private SeatLayout createSeatLayout(BusType type, int totalSeats) {
                List<Seat> seats = new ArrayList<>();
                int cols = type == BusType.LIMOUSINE ? 3 : 4;
                int rows = (int) Math.ceil((double) totalSeats / cols);

                int seatNum = 1;
                for (int row = 1; row <= rows && seatNum <= totalSeats; row++) {
                        for (int col = 1; col <= cols && seatNum <= totalSeats; col++) {
                                Seat seat = new Seat();
                                String prefix = type == BusType.SLEEPER ? "G" : (type == BusType.LIMOUSINE ? "L" : "S");
                                seat.setSeatId(prefix + String.format("%02d", seatNum));
                                seat.setRow(row);
                                seat.setCol(col);
                                seat.setActive(true);
                                seats.add(seat);
                                seatNum++;
                        }
                }

                SeatLayout layout = new SeatLayout();
                layout.setTotalRows(rows);
                layout.setTotalColumns(cols);
                layout.setSeats(seats);
                return layout;
        }

        private Trip createTrip(Route route, Bus bus, LocalDateTime departure,
                        LocalDateTime arrival, BigDecimal price) {
                Trip trip = new Trip();
                trip.setRoute(route);
                trip.setBus(bus);
                trip.setDepartureTime(departure);
                trip.setArrivalTime(arrival);
                trip.setPrice(price);
                trip.setStatus(TripStatus.SCHEDULED);
                trip.setTotalSeats(bus.getTotalSeats());
                trip.setAvailableSeats(bus.getTotalSeats());
                return trip;
        }

        private List<TripSeat> createTripSeats(Trip trip) {
                List<TripSeat> tripSeats = new ArrayList<>();
                SeatLayout layout = trip.getBus().getSeatLayout();

                if (layout != null && layout.getSeats() != null) {
                        for (Seat seat : layout.getSeats()) {
                                TripSeat tripSeat = new TripSeat();
                                tripSeat.setTrip(trip);
                                tripSeat.setSeatId(seat.getSeatId());
                                tripSeat.setRow(seat.getRow());
                                tripSeat.setCol(seat.getCol());
                                tripSeat.setStatus(SeatStatus.AVAILABLE);
                                tripSeat.setDeleted(false);
                                tripSeats.add(tripSeat);
                        }
                }

                return tripSeats;
        }
}
