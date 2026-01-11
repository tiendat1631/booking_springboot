package com.dkpm.bus_booking_api.features.route;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dkpm.bus_booking_api.features.route.dto.CreateRouteRequest;
import com.dkpm.bus_booking_api.features.route.dto.RouteResponse;
import com.dkpm.bus_booking_api.features.route.dto.RouteSummary;
import com.dkpm.bus_booking_api.features.route.dto.UpdateRouteRequest;

public interface IRouteService {

    Page<RouteResponse> searchRoutes(
            String name,
            String code,
            String departureProvince,
            String destinationProvince,
            Boolean isActive,
            Pageable pageable);

    RouteResponse getRouteById(UUID id);

    RouteResponse createRoute(CreateRouteRequest request);

    RouteResponse updateRoute(UUID id, UpdateRouteRequest request);

    void deleteRoute(UUID id);

    List<RouteSummary> getActiveRoutes();
}
