package org.application.booking.presentation.controller;

import lombok.AllArgsConstructor;
import org.application.booking.application.feature.bus.AddBusRequest;
import org.application.booking.application.feature.bus.AddBusUseCase;
import org.application.booking.application.feature.bus.DeleteBusRequest;
import org.application.booking.application.feature.bus.DeleteBusUseCase;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/bus")
public class BusController {
    private final AddBusUseCase addBusUseCase;
    private final DeleteBusUseCase deleteBusUseCase;
    @PostMapping
    public void addBus(@RequestBody AddBusRequest addBusRequest) {
        this.addBusUseCase.addBus(addBusRequest);
    }

    @DeleteMapping
    public void deleteBus(@RequestBody DeleteBusRequest deleteBusRequest) {
        this.deleteBusUseCase.deleteBus(deleteBusRequest);
    }
}
