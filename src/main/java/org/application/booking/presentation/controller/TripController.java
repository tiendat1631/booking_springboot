package org.application.booking.presentation.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.application.booking.application.feature.trip.AddTripRequest;
import org.application.booking.application.feature.trip.AddTripUseCase;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.presentation.DTO.SearchTripRequest;
import org.application.booking.repository.TripRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/trip")
public class TripController {
    private final AddTripUseCase addTripUseCase;
    private final TripRepository tripRepository;

    @PostMapping
    public void addTrip (@RequestBody @Valid AddTripRequest addTripRequest) {
        this.addTripUseCase.addTrip(addTripRequest);
    }

    @GetMapping
    public List<Trip> getTrips(@ModelAttribute SearchTripRequest request) {
        List<Trip> trips = tripRepository.findAll(request.toSpecification());
        return trips;
    }


}
