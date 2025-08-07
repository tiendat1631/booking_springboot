package org.application.booking.presentation.controller;

import lombok.RequiredArgsConstructor;
import org.application.booking.application.feature.bus.AddBusRequest;
import org.application.booking.application.feature.bus.BusService;
import org.application.booking.application.feature.bus.UpdateLicensePlateRequest;
import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.repository.BusRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/bus")
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

    @GetMapping("/all")
    public ResponseEntity<List<Bus>> getAllBuses() {
        return ResponseEntity.ok(busService.getBuses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable UUID id) {
        return ResponseEntity.ok(busService.getBus(id));
    }
}
