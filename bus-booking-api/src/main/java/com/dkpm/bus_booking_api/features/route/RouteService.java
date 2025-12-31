package com.dkpm.bus_booking_api.features.route;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dkpm.bus_booking_api.domain.exception.ResourceNotFoundException;
import com.dkpm.bus_booking_api.domain.route.Route;
import com.dkpm.bus_booking_api.domain.route.RouteRepository;
import com.dkpm.bus_booking_api.domain.station.Province;
import com.dkpm.bus_booking_api.features.route.dto.CreateRouteRequest;
import com.dkpm.bus_booking_api.features.route.dto.RouteResponse;
import com.dkpm.bus_booking_api.features.route.dto.RouteSummary;
import com.dkpm.bus_booking_api.features.route.dto.UpdateRouteRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RouteService implements IRouteService {

    private final RouteRepository routeRepository;

    @Override
    public Page<RouteResponse> searchRoutes(
            String name,
            String code,
            String departureProvince,
            String destinationProvince,
            Boolean isActive,
            Pageable pageable) {
        return routeRepository.searchRoutes(name, code, departureProvince, destinationProvince, isActive, pageable)
                .map(RouteResponse::from);
    }

    @Override
    public RouteResponse getRouteById(UUID id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));
        return RouteResponse.from(route);
    }

    @Override
    @Transactional
    public RouteResponse createRoute(CreateRouteRequest request) {
        if (request.departureProvince().codename().equals(request.destinationProvince().codename())) {
            throw new IllegalArgumentException("Departure and destination provinces must be different");
        }

        Province departureProvince = Province.builder()
                .code(request.departureProvince().code())
                .name(request.departureProvince().name())
                .codename(request.departureProvince().codename())
                .build();

        Province destinationProvince = Province.builder()
                .code(request.destinationProvince().code())
                .name(request.destinationProvince().name())
                .codename(request.destinationProvince().codename())
                .build();

        Route route = Route.builder()
                .code(generateRouteCode(departureProvince, destinationProvince))
                .name(generateRouteName(departureProvince, destinationProvince))
                .departureProvince(departureProvince)
                .destinationProvince(destinationProvince)
                .distanceKm(request.distanceKm())
                .estimatedDurationMinutes(request.estimatedDurationMinutes())
                .basePrice(request.basePrice())
                .active(true)
                .build();

        route = routeRepository.save(route);
        return RouteResponse.from(route);
    }

    @Override
    @Transactional
    public RouteResponse updateRoute(UUID id, UpdateRouteRequest request) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));

        if (request.distanceKm() != null) {
            route.setDistanceKm(request.distanceKm());
        }
        if (request.estimatedDurationMinutes() != null) {
            route.setEstimatedDurationMinutes(request.estimatedDurationMinutes());
        }
        if (request.basePrice() != null) {
            route.setBasePrice(request.basePrice());
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

    @Override
    public List<RouteSummary> getActiveRoutes() {
        return routeRepository.findAllActive().stream()
                .map(RouteSummary::from)
                .toList();
    }

    private String generateRouteCode(Province departureProvince, Province destinationProvince) {
        String departureAbbr = getProvinceAbbreviation(departureProvince.getCodename());
        String arrivalAbbr = getProvinceAbbreviation(destinationProvince.getCodename());
        return departureAbbr + "-" + arrivalAbbr;
    }

    private String generateRouteName(Province departureProvince, Province destinationProvince) {
        return departureProvince.getName() + " - " + destinationProvince.getName();
    }

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
