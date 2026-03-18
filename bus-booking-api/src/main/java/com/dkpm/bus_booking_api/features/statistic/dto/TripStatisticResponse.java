package com.dkpm.bus_booking_api.features.statistic.dto;

import java.math.BigDecimal;

public record TripStatisticResponse(
        Long totalTicketsSold,
        Long totalTicketsCancelled,
        BigDecimal revenue

) {
}
