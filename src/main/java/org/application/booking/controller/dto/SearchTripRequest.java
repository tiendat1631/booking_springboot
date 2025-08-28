package org.application.booking.controller.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.service.trip.TripSpecification;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public record SearchTripRequest(
        @NotNull @Positive Integer departureCode,
        @NotNull @Positive Integer destinationCode,
        @NotNull LocalDate departureTime,
        @NotNull @Positive Integer ticketNum
) {
    public Specification<Trip> toSpecification() {
        return Specification.allOf(
                TripSpecification.fromLocation(departureCode),
                TripSpecification.toLocation(destinationCode),
                TripSpecification.hasDate(departureTime),
                TripSpecification.hasTicket(ticketNum)
        );
    }
}
