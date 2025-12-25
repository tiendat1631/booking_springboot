package com.dkpm.bus_booking_api.features.station;

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
import com.dkpm.bus_booking_api.features.station.dto.CreateStationRequest;
import com.dkpm.bus_booking_api.features.station.dto.StationResponse;
import com.dkpm.bus_booking_api.features.station.dto.UpdateStationRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
public class StationController {

    private final IStationService stationService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<StationResponse>>> getStations(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<StationResponse> result = stationService.searchStations(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<Page<StationResponse>>> getAllActiveStations(
            @PageableDefault(size = 10, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<StationResponse> stations = stationService.getAllActiveStations(pageable);
        return ResponseEntity.ok(ApiResponse.success(stations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StationResponse>> getStationById(@PathVariable UUID id) {
        StationResponse station = stationService.getStationById(id);
        return ResponseEntity.ok(ApiResponse.success(station));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<StationResponse>> getStationByCode(@PathVariable String code) {
        StationResponse station = stationService.getStationByCode(code);
        return ResponseEntity.ok(ApiResponse.success(station));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<StationResponse>>> getStationsByCity(
            @RequestParam String city,
            @PageableDefault(size = 10, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<StationResponse> stations = stationService.getStationsByCity(city, pageable);
        return ResponseEntity.ok(ApiResponse.success(stations));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StationResponse>> createStation(
            @Valid @RequestBody CreateStationRequest request) {
        StationResponse station = stationService.createStation(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(station, "Station created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StationResponse>> updateStation(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStationRequest request) {
        StationResponse station = stationService.updateStation(id, request);
        return ResponseEntity.ok(ApiResponse.success(station, "Station updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteStation(@PathVariable UUID id) {
        stationService.deleteStation(id);
        return ResponseEntity.ok(ApiResponse.success("Station deleted successfully"));
    }
}
