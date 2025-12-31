package com.dkpm.bus_booking_api.features.route.dto;

import com.dkpm.bus_booking_api.domain.route.Route;

public record RouteSummary(
        String code,
        String name) {

    public static RouteSummary from(Route route) {
        return new RouteSummary(route.getCode(), route.getName());
    }
}
