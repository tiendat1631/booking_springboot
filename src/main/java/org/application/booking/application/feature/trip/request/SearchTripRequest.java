package org.application.booking.application.feature.trip.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.application.booking.application.feature.trip.TripSpecification;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public record SearchTripRequest(
        @NotNull @Positive Integer departureCode,
        @NotNull @Positive Integer destinationCode,
        @NotNull LocalDate departureTime,
        @NotNull @Positive Integer ticketNums
) {
    public Specification<Trip> toSpecification() {
        return Specification.allOf(
                TripSpecification.fromLocation(departureCode),
                TripSpecification.toLocation(destinationCode),
                TripSpecification.hasDate(departureTime),
                TripSpecification.hasTicket(ticketNums)
        );
    }
}
