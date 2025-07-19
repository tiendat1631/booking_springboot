package org.application.booking.presentation.controller;

import lombok.RequiredArgsConstructor;
import org.application.booking.application.feature.bus.AddBusRequest;
import org.application.booking.application.feature.bus.AddBusUseCase;
import org.application.booking.application.feature.bus.UpdateBusRequest;
import org.application.booking.application.feature.bus.UpdateBusUseCase;
import org.application.booking.application.feature.bus.DeleteBusUseCase;
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

    private final AddBusUseCase addBusUseCase;
    private final UpdateBusUseCase updateBusUseCase;
    private final DeleteBusUseCase deleteBusUseCase;
    private final BusRepository busRepository;

    // ✅ Thêm mới xe
    @PostMapping
    public ResponseEntity<String> addBus(@RequestBody AddBusRequest request) {
        addBusUseCase.addBus(request);
        return ResponseEntity.ok("Bus created successfully.");
    }

    // ✅ Cập nhật xe
    @PutMapping("/{id}")
    public ResponseEntity<String> updateBus(@PathVariable UUID id, @RequestBody UpdateBusRequest request) {
        updateBusUseCase.updateBus(id, request);
        return ResponseEntity.ok("Bus updated successfully.");
    }

    // ✅ Xoá xe (RESTful)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBus(@PathVariable UUID id) {
        deleteBusUseCase.deleteBus(id);
        return ResponseEntity.ok("Bus deleted successfully.");
    }

    // ✅ Lấy danh sách tất cả xe
    @GetMapping("/all")
    public ResponseEntity<List<Bus>> getAllBuses() {
        return ResponseEntity.ok(busRepository.findAll());
    }

    // ✅ Lấy chi tiết 1 xe
    @GetMapping("/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable UUID id) {
        Optional<Bus> bus = busRepository.findById(id);
        return bus.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
