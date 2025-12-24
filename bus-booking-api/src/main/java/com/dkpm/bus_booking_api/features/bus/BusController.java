package com.dkpm.bus_booking_api.features.bus;

import com.dkpm.bus_booking_api.domain.bus.Bus;
import com.dkpm.bus_booking_api.domain.bus.BusStatus;
import com.dkpm.bus_booking_api.domain.bus.BusType;
import com.dkpm.bus_booking_api.features.bus.dto.BusDetailResponse;
import com.dkpm.bus_booking_api.features.bus.dto.BusSummaryResponse;
import com.dkpm.bus_booking_api.features.bus.dto.CreateBusRequest;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/buses")
@RequiredArgsConstructor
public class BusController {

    private final IBusService busService;

    @GetMapping
    public ResponseEntity<Page<BusSummaryResponse>> getBuses(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) BusType type,
            @RequestParam(required = false) BusStatus status,
            @RequestParam(required = false) Integer minSeats,
            @RequestParam(required = false) Integer maxSeats,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<BusSummaryResponse> result = busService.searchBuses(keyword, type, status, minSeats, maxSeats, pageable);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{busId}")
    public ResponseEntity<BusDetailResponse> getBusById(@PathVariable UUID busId) {
        BusDetailResponse busDetail = busService.getBusDetail(busId);
        return ResponseEntity.ok(busDetail);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BusDetailResponse> createBus(@RequestBody CreateBusRequest request) {
        Bus createdBus = busService.createBus(request.licensePlate(), request.type());
        return ResponseEntity.ok(BusDetailResponse.from(createdBus));
    }
}