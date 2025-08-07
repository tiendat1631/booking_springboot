package org.application.booking.application.feature.trip;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.application.booking.domain.aggregates.TripModel.Province;
import org.application.booking.domain.aggregates.TripModel.Route;

import java.time.LocalDateTime;
import java.util.UUID;

public record AddTripRequest(
        @NotNull @Valid RouteDTO route,
        @NotNull UUID busId,
        @NotNull @Positive float price,
        @NotNull @Future LocalDateTime departureTime,
        @NotNull @Future LocalDateTime estimateArrivalTime
) {}

record ProvinceDTO(
        @NotBlank String name,
        @NotNull Integer code,
        @NotBlank String codename
) {
    public Province toProvince() {
        return new Province(name, code, codename);
    }
}

record RouteDTO(
        @NotNull @Valid ProvinceDTO departure,
        @NotNull @Valid ProvinceDTO destination
) {
    public Route toRoute() {
        return new Route(departure.toProvince(), destination.toProvince());
    }
}




