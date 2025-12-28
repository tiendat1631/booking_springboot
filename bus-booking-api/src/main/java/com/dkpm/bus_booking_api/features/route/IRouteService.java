package com.dkpm.bus_booking_api.features.route;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dkpm.bus_booking_api.features.route.dto.CreateRouteRequest;
import com.dkpm.bus_booking_api.features.route.dto.RouteResponse;
import com.dkpm.bus_booking_api.features.route.dto.UpdateRouteRequest;

public interface IRouteService {

    /**
     * Unified search method for routes with flexible filtering
     * 
     * @param name               Search by route name
     * @param code               Search by route code
     * @param departureStationId Filter by departure station
     * @param arrivalStationId   Filter by arrival station
     * @param isActive           Filter by active status (null = all)
     * @param pageable           Pagination info
     */
    Page<RouteResponse> searchRoutes(
            String name,
            String code,
            UUID departureStationId,
            UUID arrivalStationId,
            Boolean isActive,
            Pageable pageable);

    RouteResponse getRouteById(UUID id);

    RouteResponse createRoute(CreateRouteRequest request);

    RouteResponse updateRoute(UUID id, UpdateRouteRequest request);

    void deleteRoute(UUID id);
}
