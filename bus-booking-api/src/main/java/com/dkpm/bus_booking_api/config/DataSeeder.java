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
import com.dkpm.bus_booking_api.domain.station.Province;
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
                        Station saigonStation = createStation("Bến xe Miền Đông Mới",
                                        "292 Đinh Bộ Lĩnh, P.26", 79, "Thành phố Hồ Chí Minh", "thanh_pho_ho_chi_minh",
                                        10.8231, 106.6297);
                        Station dalatStation = createStation("Bến xe Đà Lạt",
                                        "01 Tô Hiến Thành", 68, "Tỉnh Lâm Đồng", "tinh_lam_dong",
                                        11.9404, 108.4583);
                        Station nhatrangStation = createStation("Bến xe phía Bắc Nha Trang",
                                        "58 đường 23/10", 56, "Tỉnh Khánh Hòa", "tinh_khanh_hoa",
                                        12.2388, 109.1967);
                        Station vungtauStation = createStation("Bến xe Vũng Tàu",
                                        "192 Nam Kỳ Khởi Nghĩa", 77, "Tỉnh Bà Rịa - Vũng Tàu", "tinh_ba_ria_vung_tau",
                                        10.3460, 107.0843);
                        Station canthoStation = createStation("Bến xe Cần Thơ",
                                        "91B Nguyễn Văn Linh", 92, "Thành phố Cần Thơ", "thanh_pho_can_tho",
                                        10.0452, 105.7469);
                        Station hanoiStation = createStation("Bến xe Nước Ngầm",
                                        "Giáp Bát", 1, "Thành phố Hà Nội", "thanh_pho_ha_noi",
                                        20.9802, 105.8401);

                        List<Station> stations = stationRepository.saveAll(List.of(
                                        saigonStation, dalatStation, nhatrangStation,
                                        vungtauStation, canthoStation, hanoiStation));
                        log.info("Created {} stations", stations.size());

                        // ========== ROUTES ==========
                        Route sgDalatRoute = createRoute("Sài Gòn - Đà Lạt",
                                        saigonStation, dalatStation, 305, 420, new BigDecimal("280000"));
                        Route sgNhatrangRoute = createRoute("Sài Gòn - Nha Trang",
                                        saigonStation, nhatrangStation, 450, 540, new BigDecimal("350000"));
                        Route sgVungtauRoute = createRoute("Sài Gòn - Vũng Tàu",
                                        saigonStation, vungtauStation, 125, 150, new BigDecimal("120000"));
                        Route sgCanthoRoute = createRoute("Sài Gòn - Cần Thơ",
                                        saigonStation, canthoStation, 170, 210, new BigDecimal("150000"));
                        Route dalatNhatrangRoute = createRoute("Đà Lạt - Nha Trang",
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

                        // ========== TRIPS FOR JANUARY 25, 2026 ==========
                        LocalDateTime jan25 = LocalDateTime.of(2026, 1, 25, 0, 0);

                        // Morning trips - Sài Gòn -> Đà Lạt
                        Trip trip6 = createTrip(sgDalatRoute, sleeperBus1,
                                        jan25.withHour(6).withMinute(0),
                                        jan25.withHour(13).withMinute(0),
                                        new BigDecimal("290000"));
                        Trip trip7 = createTrip(sgDalatRoute, sleeperBus2,
                                        jan25.withHour(7).withMinute(30),
                                        jan25.withHour(14).withMinute(30),
                                        new BigDecimal("285000"));
                        Trip trip8 = createTrip(sgDalatRoute, limousineBus,
                                        jan25.withHour(8).withMinute(0),
                                        jan25.withHour(15).withMinute(0),
                                        new BigDecimal("450000"));

                        // More Sài Gòn -> Đà Lạt trips on Jan 25
                        Trip tripSgDl1 = createTrip(sgDalatRoute, seaterBus1,
                                        jan25.withHour(5).withMinute(0),
                                        jan25.withHour(12).withMinute(0),
                                        new BigDecimal("240000"));
                        Trip tripSgDl2 = createTrip(sgDalatRoute, sleeperBus1,
                                        jan25.withHour(9).withMinute(0),
                                        jan25.withHour(16).withMinute(0),
                                        new BigDecimal("295000"));
                        Trip tripSgDl3 = createTrip(sgDalatRoute, sleeperBus2,
                                        jan25.withHour(10).withMinute(0),
                                        jan25.withHour(17).withMinute(0),
                                        new BigDecimal("290000"));
                        Trip tripSgDl4 = createTrip(sgDalatRoute, seaterBus1,
                                        jan25.withHour(11).withMinute(0),
                                        jan25.withHour(18).withMinute(0),
                                        new BigDecimal("250000"));
                        Trip tripSgDl5 = createTrip(sgDalatRoute, limousineBus,
                                        jan25.withHour(12).withMinute(0),
                                        jan25.withHour(19).withMinute(0),
                                        new BigDecimal("460000"));
                        Trip tripSgDl6 = createTrip(sgDalatRoute, sleeperBus1,
                                        jan25.withHour(13).withMinute(30),
                                        jan25.withHour(20).withMinute(30),
                                        new BigDecimal("285000"));
                        Trip tripSgDl7 = createTrip(sgDalatRoute, sleeperBus2,
                                        jan25.withHour(14).withMinute(0),
                                        jan25.withHour(21).withMinute(0),
                                        new BigDecimal("280000"));
                        Trip tripSgDl8 = createTrip(sgDalatRoute, seaterBus1,
                                        jan25.withHour(15).withMinute(0),
                                        jan25.withHour(22).withMinute(0),
                                        new BigDecimal("255000"));
                        Trip tripSgDl9 = createTrip(sgDalatRoute, limousineBus,
                                        jan25.withHour(16).withMinute(0),
                                        jan25.withHour(23).withMinute(0),
                                        new BigDecimal("470000"));
                        Trip tripSgDl10 = createTrip(sgDalatRoute, sleeperBus1,
                                        jan25.withHour(18).withMinute(0),
                                        jan25.plusDays(1).withHour(1).withMinute(0),
                                        new BigDecimal("275000"));
                        Trip tripSgDl11 = createTrip(sgDalatRoute, sleeperBus2,
                                        jan25.withHour(19).withMinute(0),
                                        jan25.plusDays(1).withHour(2).withMinute(0),
                                        new BigDecimal("270000"));
                        Trip tripSgDl12 = createTrip(sgDalatRoute, seaterBus1,
                                        jan25.withHour(20).withMinute(0),
                                        jan25.plusDays(1).withHour(3).withMinute(0),
                                        new BigDecimal("245000"));

                        // Morning trips - Sài Gòn -> Nha Trang
                        Trip trip9 = createTrip(sgNhatrangRoute, seaterBus1,
                                        jan25.withHour(6).withMinute(30),
                                        jan25.withHour(15).withMinute(30),
                                        new BigDecimal("360000"));
                        Trip trip10 = createTrip(sgNhatrangRoute, sleeperBus1,
                                        jan25.withHour(9).withMinute(0),
                                        jan25.withHour(18).withMinute(0),
                                        new BigDecimal("380000"));

                        // Morning trips - Sài Gòn -> Vũng Tàu
                        Trip trip11 = createTrip(sgVungtauRoute, limousineBus,
                                        jan25.withHour(7).withMinute(0),
                                        jan25.withHour(9).withMinute(30),
                                        new BigDecimal("150000"));
                        Trip trip12 = createTrip(sgVungtauRoute, seaterBus1,
                                        jan25.withHour(8).withMinute(30),
                                        jan25.withHour(11).withMinute(0),
                                        new BigDecimal("100000"));

                        // Afternoon trips - Sài Gòn -> Cần Thơ
                        Trip trip13 = createTrip(sgCanthoRoute, sleeperBus2,
                                        jan25.withHour(13).withMinute(0),
                                        jan25.withHour(16).withMinute(30),
                                        new BigDecimal("155000"));
                        Trip trip14 = createTrip(sgCanthoRoute, seaterBus1,
                                        jan25.withHour(14).withMinute(0),
                                        jan25.withHour(17).withMinute(30),
                                        new BigDecimal("140000"));

                        // Evening trips - Đà Lạt -> Nha Trang
                        Trip trip15 = createTrip(dalatNhatrangRoute, sleeperBus1,
                                        jan25.withHour(18).withMinute(0),
                                        jan25.withHour(21).withMinute(0),
                                        new BigDecimal("160000"));

                        // ========== MORE SÀI GÒN -> ĐÀ LẠT TRIPS ==========
                        // Jan 25 - Night trips
                        Trip trip16 = createTrip(sgDalatRoute, sleeperBus1,
                                        jan25.withHour(21).withMinute(0),
                                        jan25.plusDays(1).withHour(4).withMinute(0),
                                        new BigDecimal("280000"));
                        Trip trip17 = createTrip(sgDalatRoute, sleeperBus2,
                                        jan25.withHour(22).withMinute(0),
                                        jan25.plusDays(1).withHour(5).withMinute(0),
                                        new BigDecimal("275000"));
                        Trip trip18 = createTrip(sgDalatRoute, limousineBus,
                                        jan25.withHour(23).withMinute(0),
                                        jan25.plusDays(1).withHour(6).withMinute(0),
                                        new BigDecimal("480000"));

                        // Jan 26 - Morning trips
                        LocalDateTime jan26 = jan25.plusDays(1);
                        Trip trip19 = createTrip(sgDalatRoute, sleeperBus1,
                                        jan26.withHour(5).withMinute(0),
                                        jan26.withHour(12).withMinute(0),
                                        new BigDecimal("295000"));
                        Trip trip20 = createTrip(sgDalatRoute, seaterBus1,
                                        jan26.withHour(6).withMinute(0),
                                        jan26.withHour(13).withMinute(0),
                                        new BigDecimal("250000"));
                        Trip trip21 = createTrip(sgDalatRoute, sleeperBus2,
                                        jan26.withHour(7).withMinute(0),
                                        jan26.withHour(14).withMinute(0),
                                        new BigDecimal("290000"));
                        Trip trip22 = createTrip(sgDalatRoute, limousineBus,
                                        jan26.withHour(8).withMinute(0),
                                        jan26.withHour(15).withMinute(0),
                                        new BigDecimal("450000"));
                        Trip trip23 = createTrip(sgDalatRoute, sleeperBus1,
                                        jan26.withHour(9).withMinute(30),
                                        jan26.withHour(16).withMinute(30),
                                        new BigDecimal("285000"));

                        // Jan 26 - Afternoon/Evening trips
                        Trip trip24 = createTrip(sgDalatRoute, seaterBus1,
                                        jan26.withHour(13).withMinute(0),
                                        jan26.withHour(20).withMinute(0),
                                        new BigDecimal("260000"));
                        Trip trip25 = createTrip(sgDalatRoute, sleeperBus2,
                                        jan26.withHour(14).withMinute(0),
                                        jan26.withHour(21).withMinute(0),
                                        new BigDecimal("280000"));
                        Trip trip26 = createTrip(sgDalatRoute, limousineBus,
                                        jan26.withHour(15).withMinute(0),
                                        jan26.withHour(22).withMinute(0),
                                        new BigDecimal("460000"));
                        Trip trip27 = createTrip(sgDalatRoute, sleeperBus1,
                                        jan26.withHour(20).withMinute(0),
                                        jan26.plusDays(1).withHour(3).withMinute(0),
                                        new BigDecimal("275000"));

                        // Jan 27 - Various trips
                        LocalDateTime jan27 = jan26.plusDays(1);
                        Trip trip28 = createTrip(sgDalatRoute, sleeperBus1,
                                        jan27.withHour(6).withMinute(0),
                                        jan27.withHour(13).withMinute(0),
                                        new BigDecimal("290000"));
                        Trip trip29 = createTrip(sgDalatRoute, sleeperBus2,
                                        jan27.withHour(8).withMinute(0),
                                        jan27.withHour(15).withMinute(0),
                                        new BigDecimal("285000"));
                        Trip trip30 = createTrip(sgDalatRoute, seaterBus1,
                                        jan27.withHour(10).withMinute(0),
                                        jan27.withHour(17).withMinute(0),
                                        new BigDecimal("255000"));
                        Trip trip31 = createTrip(sgDalatRoute, limousineBus,
                                        jan27.withHour(14).withMinute(0),
                                        jan27.withHour(21).withMinute(0),
                                        new BigDecimal("470000"));
                        Trip trip32 = createTrip(sgDalatRoute, sleeperBus1,
                                        jan27.withHour(19).withMinute(0),
                                        jan27.plusDays(1).withHour(2).withMinute(0),
                                        new BigDecimal("280000"));

                        // Jan 28 - Morning trips
                        LocalDateTime jan28 = jan27.plusDays(1);
                        Trip trip33 = createTrip(sgDalatRoute, sleeperBus2,
                                        jan28.withHour(6).withMinute(0),
                                        jan28.withHour(13).withMinute(0),
                                        new BigDecimal("295000"));
                        Trip trip34 = createTrip(sgDalatRoute, seaterBus1,
                                        jan28.withHour(7).withMinute(30),
                                        jan28.withHour(14).withMinute(30),
                                        new BigDecimal("260000"));
                        Trip trip35 = createTrip(sgDalatRoute, limousineBus,
                                        jan28.withHour(9).withMinute(0),
                                        jan28.withHour(16).withMinute(0),
                                        new BigDecimal("455000"));

                        List<Trip> trips = tripRepository.saveAll(List.of(
                                        trip1, trip2, trip3, trip4, trip5,
                                        trip6, trip7, trip8, trip9, trip10,
                                        trip11, trip12, trip13, trip14, trip15,
                                        trip16, trip17, trip18, trip19, trip20,
                                        trip21, trip22, trip23, trip24, trip25,
                                        trip26, trip27, trip28, trip29, trip30,
                                        trip31, trip32, trip33, trip34, trip35,
                                        tripSgDl1, tripSgDl2, tripSgDl3, tripSgDl4,
                                        tripSgDl5, tripSgDl6, tripSgDl7, tripSgDl8,
                                        tripSgDl9, tripSgDl10, tripSgDl11, tripSgDl12));
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

        private Station createStation(String name, String address,
                        Integer provinceCode, String provinceName, String provinceCodename,
                        double lat, double lon) {
                Station station = new Station();
                station.setName(name);
                station.setAddress(address);
                station.setProvince(Province.builder()
                                .code(provinceCode)
                                .name(provinceName)
                                .codename(provinceCodename)
                                .build());
                station.setLatitude(lat);
                station.setLongitude(lon);
                station.setActive(true);
                station.setDeleted(false);
                return station;
        }

        private Route createRoute(String name, Station departure,
                        Station arrival, int distance, int duration, BigDecimal price) {
                Route route = new Route();
                route.setName(name);
                route.setCode(generateRouteCode(departure, arrival));
                route.setDepartureStation(departure);
                route.setArrivalStation(arrival);
                route.setDistanceKm(distance);
                route.setEstimatedDurationMinutes(duration);
                route.setBasePrice(price);
                route.setActive(true);
                route.setDeleted(false);
                return route;
        }

        private String generateRouteCode(Station departure, Station arrival) {
                String departureAbbr = getProvinceAbbreviation(departure.getProvince().getCodename());
                String arrivalAbbr = getProvinceAbbreviation(arrival.getProvince().getCodename());
                String prefix = departureAbbr + "-" + arrivalAbbr + "-";

                String timestamp = String.valueOf(System.currentTimeMillis());
                String suffix = timestamp.substring(timestamp.length() - 4);
                String code = prefix + suffix;

                // Add small delay to ensure unique timestamps for each route
                try {
                        Thread.sleep(1);
                } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                }
                return code;
        }

        /**
         * Extract abbreviation from province codename.
         * E.g., "thanh_pho_ho_chi_minh" -> "HCM"
         * "tinh_ba_ria_vung_tau" -> "VT"
         * "tinh_khanh_hoa" -> "KH"
         */
        private String getProvinceAbbreviation(String codename) {
                if (codename == null || codename.isBlank()) {
                        return "XX";
                }

                // Remove prefix "tinh_", "thanh_pho_"
                String name = codename
                                .replaceFirst("^tinh_", "")
                                .replaceFirst("^thanh_pho_", "");

                // Handle special cases like "ba_ria_vung_tau" -> take last part "vung_tau"
                if (name.contains("_vung_tau")) {
                        name = "vung_tau";
                }

                // Get first letter of each word (split by underscore)
                String[] words = name.split("_");
                StringBuilder abbr = new StringBuilder();
                for (String word : words) {
                        if (!word.isEmpty()) {
                                abbr.append(Character.toUpperCase(word.charAt(0)));
                        }
                }

                return abbr.length() > 0 ? abbr.toString() : "XX";
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
