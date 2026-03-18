package com.dkpm.bus_booking_api.features.statistic.dto;

import java.math.BigDecimal;

// all fields in parentheses are declared private final. it means we cannot change value after declaring
public record DashboardStatisticResponse (
        long totalBookings,
        long totalTrips,
        long totalTicketsSold,
        BigDecimal revenueToday,
        BigDecimal revenueThisMonth,
        BigDecimal revenueThisYear,
        BigDecimal totalRevenueByTrip
        ){
}
