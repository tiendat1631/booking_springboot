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
    public Page<RouteResponse> searchRoutes(String keyword, Pageable pageable) {
        return routeRepository.searchRoutes(keyword, pageable)
                .map(RouteResponse::from);
    }

    @Override
    public RouteResponse getRouteById(UUID id) {
        Route route = routeRepository.findByIdWithStations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));
        return RouteResponse.from(route);
    }

    @Override
    public RouteResponse getRouteByCode(String code) {
        Route route = routeRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with code: " + code));
        return RouteResponse.from(route);
    }

    @Override
    public Page<RouteResponse> findRoutesByStations(UUID departureStationId, UUID arrivalStationId, Pageable pageable) {
        return routeRepository.findByStations(departureStationId, arrivalStationId, pageable)
                .map(RouteResponse::from);
    }

    @Override
    public Page<RouteResponse> getAllActiveRoutes(Pageable pageable) {
        return routeRepository.findByActiveTrueAndDeletedFalse(pageable)
                .map(RouteResponse::from);
    }

    @Override
    @Transactional
    public RouteResponse createRoute(CreateRouteRequest request) {
        if (routeRepository.existsByCode(request.code())) {
            throw new IllegalArgumentException("Route code already exists: " + request.code());
        }

        if (request.departureStationId().equals(request.arrivalStationId())) {
            throw new IllegalArgumentException("Departure and arrival stations must be different");
        }

        Station departureStation = stationRepository.findById(request.departureStationId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Departure station not found with id: " + request.departureStationId()));

        Station arrivalStation = stationRepository.findById(request.arrivalStationId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Arrival station not found with id: " + request.arrivalStationId()));

        Route route = Route.builder()
                .name(request.name())
                .code(request.code().toUpperCase())
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
        if (request.code() != null) {
            if (!route.getCode().equals(request.code()) && routeRepository.existsByCode(request.code())) {
                throw new IllegalArgumentException("Route code already exists: " + request.code());
            }
            route.setCode(request.code().toUpperCase());
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
}
