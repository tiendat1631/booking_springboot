package org.application.booking.presentation.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.application.booking.application.feature.trip.AddTripRequest;
import org.application.booking.application.feature.trip.AddTripUseCase;
import org.application.booking.domain.entity.Trip;
import org.application.booking.presentation.DTO.SearchTripRequest;
import org.application.booking.repository.TripRepository;
import org.springframework.data.jpa.domain.Specification;
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
    public List<Trip> getAllTrips(@ModelAttribute SearchTripRequest searchTripRequest) {
        Specification<Trip> spec = searchTripRequest.toSpecification();

        return tripRepository.findAll(spec);
    }


}
