package org.application.booking.presentation.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.application.booking.application.feature.trip.AddTripRequest;
import org.application.booking.application.feature.trip.AddTripUseCase;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/trip")
public class TripController {
    private final AddTripUseCase addTripUseCase;


    @PostMapping
    public void addTrip (@RequestBody @Valid AddTripRequest addTripRequest) {
        this.addTripUseCase.addTrip(addTripRequest);
    }
}
