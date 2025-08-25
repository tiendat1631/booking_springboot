package org.application.booking.presentation.admin;

import lombok.RequiredArgsConstructor;
import org.application.booking.application.feature.bus.BusService;
import org.application.booking.application.feature.bus.request.AddBusRequest;
import org.application.booking.application.feature.bus.request.UpdateLicensePlateRequest;
import org.application.booking.application.feature.bus.response.BusResponse;
import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.presentation.ApiResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bus")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class BusController {
    private final BusService busService;

    @PostMapping
    public ResponseEntity<ApiResponse<BusResponse>> addBus(@RequestBody AddBusRequest request) {
        Bus bus = busService.addBus(request);

        ApiResponse<BusResponse> response = ApiResponse.success("Bus created successfully",
                BusResponse.fromWithSeat(bus));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BusResponse>> updateBus(@PathVariable UUID id, @RequestBody UpdateLicensePlateRequest request) {
        Bus bus = busService.updateLicensePlate(id, request);

        ApiResponse<BusResponse> response = ApiResponse.success("Bus updated successfully",
                BusResponse.fromWithNoSeat(bus));
        return ResponseEntity.ok(response);
    }

    // TODO: Need to handle constraint
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBus(@PathVariable UUID id) {
        busService.deleteBus(id);
        ApiResponse<Void> response = ApiResponse.success("Bus deleted successfully", null);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BusResponse>>> getAllBuses(
            @RequestParam(name = "current", defaultValue = "0") int current,
            @RequestParam(name = "pageSize", defaultValue = "1") int pageSize
    ) {
        Pageable pageable = PageRequest.of(current, pageSize);
        List<Bus> buses = busService.getBuses(pageable);
        ApiResponse<List<BusResponse>> response = ApiResponse.success("Buses fetched successfully",
                buses.stream().map(BusResponse::fromWithNoSeat).toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BusResponse>> getBusById(@PathVariable UUID id) {
        Bus bus = busService.getBus(id);
        ApiResponse<BusResponse> response = ApiResponse.success("Bus fetched successfully",
                BusResponse.fromWithSeat(bus));
        return ResponseEntity.ok(response);
    }
}
