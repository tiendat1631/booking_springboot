package com.dkpm.bus_booking_api.features.statistic;

import com.dkpm.bus_booking_api.features.statistic.dto.DashboardStatisticResponse;
import com.dkpm.bus_booking_api.features.statistic.dto.RevenueChartResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface IStatisticService {
    /**
     * Lấy toàn bộ thông số tổng quan cho Dashboard Admin
     * Mặc định có thể là thống kê của tháng hiện tại hoặc 30 ngày gần nhất
     */
    DashboardStatisticResponse getDashboardStats();

    /**
     * Lấy thống kê chi tiết theo khoảng thời gian tùy chọn
     */
    //DashboardStatisticResponse getStatisticsByRange(LocalDate startDate, LocalDate endDate);

    /**
     * Thống kê doanh thu theo một chuyến xe cụ thể
     */
    //DashboardStatisticResponse getStatisticsByTrip(UUID tripId);

    /**
     * thống kê bằng chart
     */
    //List<RevenueChartResponse> getRevenueChart(LocalDate startDate, LocalDate endDate);

}
