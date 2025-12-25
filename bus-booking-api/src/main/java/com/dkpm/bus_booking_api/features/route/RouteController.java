package com.dkpm.bus_booking_api.features.route;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dkpm.bus_booking_api.application.response.ApiResponse;
import com.dkpm.bus_booking_api.features.route.dto.CreateRouteRequest;
import com.dkpm.bus_booking_api.features.route.dto.RouteResponse;
import com.dkpm.bus_booking_api.features.route.dto.UpdateRouteRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final IRouteService routeService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<RouteResponse>>> getRoutes(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<RouteResponse> result = routeService.searchRoutes(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<Page<RouteResponse>>> getAllActiveRoutes(
            @PageableDefault(size = 10, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<RouteResponse> routes = routeService.getAllActiveRoutes(pageable);
        return ResponseEntity.ok(ApiResponse.success(routes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteResponse>> getRouteById(@PathVariable UUID id) {
        RouteResponse route = routeService.getRouteById(id);
        return ResponseEntity.ok(ApiResponse.success(route));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<RouteResponse>> getRouteByCode(@PathVariable String code) {
        RouteResponse route = routeService.getRouteByCode(code);
        return ResponseEntity.ok(ApiResponse.success(route));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<RouteResponse>>> searchRoutes(
            @RequestParam UUID departureStationId,
            @RequestParam UUID arrivalStationId,
            @PageableDefault(size = 10, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<RouteResponse> routes = routeService.findRoutesByStations(departureStationId, arrivalStationId, pageable);
        return ResponseEntity.ok(ApiResponse.success(routes));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RouteResponse>> createRoute(@Valid @RequestBody CreateRouteRequest request) {
        RouteResponse route = routeService.createRoute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(route, "Route created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RouteResponse>> updateRoute(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRouteRequest request) {
        RouteResponse route = routeService.updateRoute(id, request);
        return ResponseEntity.ok(ApiResponse.success(route, "Route updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(@PathVariable UUID id) {
        routeService.deleteRoute(id);
        return ResponseEntity.ok(ApiResponse.success("Route deleted successfully"));
    }
}
