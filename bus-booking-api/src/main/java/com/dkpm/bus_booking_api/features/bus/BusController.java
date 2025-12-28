package com.dkpm.bus_booking_api.features.bus;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dkpm.bus_booking_api.application.response.ApiResponse;
import com.dkpm.bus_booking_api.domain.bus.Bus;
import com.dkpm.bus_booking_api.domain.bus.BusStatus;
import com.dkpm.bus_booking_api.domain.bus.BusType;
import com.dkpm.bus_booking_api.features.bus.dto.BusDetailResponse;
import com.dkpm.bus_booking_api.features.bus.dto.BusSummaryResponse;
import com.dkpm.bus_booking_api.features.bus.dto.CreateBusRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/buses")
@RequiredArgsConstructor
public class BusController {

    private final IBusService busService;

    @GetMapping("/types")
    public ResponseEntity<ApiResponse<BusType[]>> getBusTypes() {
        return ResponseEntity.ok(ApiResponse.success(BusType.values()));
    }

    @GetMapping("/statuses")
    public ResponseEntity<ApiResponse<BusStatus[]>> getBusStatuses() {
        return ResponseEntity.ok(ApiResponse.success(BusStatus.values()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<BusSummaryResponse>>> getBuses(
            @RequestParam(required = false) String licensePlate,
            @RequestParam(required = false) BusType type,
            @RequestParam(required = false) BusStatus status,
            @RequestParam(required = false) Integer minSeats,
            @RequestParam(required = false) Integer maxSeats,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<BusSummaryResponse> result = busService.searchBuses(licensePlate, type, status, minSeats, maxSeats,
                pageable);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{busId}")
    public ResponseEntity<ApiResponse<BusDetailResponse>> getBusById(@PathVariable UUID busId) {
        BusDetailResponse busDetail = busService.getBusDetail(busId);
        return ResponseEntity.ok(ApiResponse.success(busDetail));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BusDetailResponse>> createBus(@RequestBody CreateBusRequest request) {
        Bus createdBus = busService.createBus(request.licensePlate(), request.type());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(BusDetailResponse.from(createdBus), "Bus created successfully"));
    }
}