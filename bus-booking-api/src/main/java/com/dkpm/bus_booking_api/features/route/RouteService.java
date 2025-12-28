package com.dkpm.bus_booking_api.features.route;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dkpm.bus_booking_api.domain.exception.ResourceNotFoundException;
import com.dkpm.bus_booking_api.domain.route.Route;
import com.dkpm.bus_booking_api.domain.route.RouteRepository;
import com.dkpm.bus_booking_api.domain.station.Station;
import com.dkpm.bus_booking_api.domain.station.StationRepository;
import com.dkpm.bus_booking_api.features.route.dto.CreateRouteRequest;
import com.dkpm.bus_booking_api.features.route.dto.RouteResponse;
import com.dkpm.bus_booking_api.features.route.dto.UpdateRouteRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RouteService implements IRouteService {

    private final RouteRepository routeRepository;
    private final StationRepository stationRepository;

    @Override
    public Page<RouteResponse> searchRoutes(
            String name,
            String code,
            UUID departureStationId,
            UUID arrivalStationId,
            Boolean isActive,
            Pageable pageable) {
        return routeRepository.searchRoutes(name, code, departureStationId, arrivalStationId, isActive, pageable)
                .map(RouteResponse::from);
    }

    @Override
    public RouteResponse getRouteById(UUID id) {
        Route route = routeRepository.findByIdWithStations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));
        return RouteResponse.from(route);
    }

    @Override
    @Transactional
    public RouteResponse createRoute(CreateRouteRequest request) {
        if (request.departureStationId().equals(request.arrivalStationId())) {
            throw new IllegalArgumentException("Departure and arrival stations must be different");
        }

        Station departureStation = stationRepository.findById(request.departureStationId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Departure station not found with id: " + request.departureStationId()));

        Station arrivalStation = stationRepository.findById(request.arrivalStationId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Arrival station not found with id: " + request.arrivalStationId()));

        String routeCode = generateRouteCode(departureStation, arrivalStation);

        Route route = Route.builder()
                .name(request.name())
                .code(routeCode)
                .departureStation(departureStation)
                .arrivalStation(arrivalStation)
                .distanceKm(request.distanceKm())
                .estimatedDurationMinutes(request.estimatedDurationMinutes())
                .basePrice(request.basePrice())
                .description(request.description())
                .active(true)
                .build();

        route = routeRepository.save(route);
        return RouteResponse.from(route);
    }

    @Override
    @Transactional
    public RouteResponse updateRoute(UUID id, UpdateRouteRequest request) {
        Route route = routeRepository.findByIdWithStations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));

        if (request.name() != null) {
            route.setName(request.name());
        }
        if (request.departureStationId() != null) {
            Station departureStation = stationRepository.findById(request.departureStationId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Departure station not found with id: " + request.departureStationId()));
            route.setDepartureStation(departureStation);
        }
        if (request.arrivalStationId() != null) {
            Station arrivalStation = stationRepository.findById(request.arrivalStationId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Arrival station not found with id: " + request.arrivalStationId()));
            route.setArrivalStation(arrivalStation);
        }

        // Validate different stations
        if (route.getDepartureStation().getId().equals(route.getArrivalStation().getId())) {
            throw new IllegalArgumentException("Departure and arrival stations must be different");
        }

        if (request.distanceKm() != null) {
            route.setDistanceKm(request.distanceKm());
        }
        if (request.estimatedDurationMinutes() != null) {
            route.setEstimatedDurationMinutes(request.estimatedDurationMinutes());
        }
        if (request.basePrice() != null) {
            route.setBasePrice(request.basePrice());
        }
        if (request.description() != null) {
            route.setDescription(request.description());
        }
        if (request.active() != null) {
            route.setActive(request.active());
        }

        route = routeRepository.save(route);
        return RouteResponse.from(route);
    }

    @Override
    @Transactional
    public void deleteRoute(UUID id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));

        route.setDeleted(true);
        route.setActive(false);
        routeRepository.save(route);
    }

    private String generateRouteCode(Station departureStation, Station arrivalStation) {
        String departureAbbr = getProvinceAbbreviation(departureStation.getProvince().getCodename());
        String arrivalAbbr = getProvinceAbbreviation(arrivalStation.getProvince().getCodename());
        String prefix = departureAbbr + "-" + arrivalAbbr + "-";

        // Generate 4-digit suffix
        String timestamp = String.valueOf(System.currentTimeMillis());
        String suffix = timestamp.substring(timestamp.length() - 4);
        String code = prefix + suffix;

        // Ensure uniqueness
        while (routeRepository.existsByCode(code)) {
            timestamp = String.valueOf(System.currentTimeMillis());
            suffix = timestamp.substring(timestamp.length() - 4);
            code = prefix + suffix;
        }
        return code;
    }

    /**
     * Extract abbreviation from province codename.
     * "thanh_pho_ho_chi_minh" -> "HCM"
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

}
