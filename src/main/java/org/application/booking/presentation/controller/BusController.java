package org.application.booking.presentation.controller;

import lombok.RequiredArgsConstructor;
import org.application.booking.application.feature.bus.AddBusRequest;
import org.application.booking.application.feature.bus.BusService;
import org.application.booking.application.feature.bus.UpdateLicensePlateRequest;
import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.presentation.ApiResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bus")
@RequiredArgsConstructor
public class BusController {

    private final BusService busService;

    @PostMapping
    public ResponseEntity<String> addBus(@RequestBody AddBusRequest request) {
        busService.addBus(request);
        return ResponseEntity.ok("Bus created successfully.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateBus(@PathVariable UUID id, @RequestBody UpdateLicensePlateRequest request) {
        busService.updateLicensePlate(id, request);
        return ResponseEntity.ok("Bus updated successfully.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBus(@PathVariable UUID id) {
        busService.deleteBus(id);
        return ResponseEntity.ok("Bus deleted successfully.");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Bus>>> getAllBuses(
            @RequestParam(name = "current", defaultValue = "0") int current,
            @RequestParam(name = "pageSize", defaultValue = "1") int pageSize
    ) {
        Pageable pageable = PageRequest.of(current, pageSize);
        List<Bus> buses = busService.getBuses(pageable);
        ApiResponse<List<Bus>> response = ApiResponse.success("Bus fetched successfully", buses);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable UUID id) {
        return ResponseEntity.ok(busService.getBus(id));
    }
}
