package com.dkpm.bus_booking_api.features.statistic.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RevenueChartResponse(
        LocalDate date,
        BigDecimal revenue
) {}