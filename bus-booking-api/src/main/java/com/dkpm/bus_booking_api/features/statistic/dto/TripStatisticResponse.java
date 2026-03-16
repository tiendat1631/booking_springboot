package com.dkpm.bus_booking_api.features.statistic.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record TripStatisticResponse(
        UUID tripId,
        long totalTicketsSold,
        BigDecimal revenue,
        double occupancyRate
) {
}
