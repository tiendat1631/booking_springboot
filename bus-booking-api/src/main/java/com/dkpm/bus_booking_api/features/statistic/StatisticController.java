package com.dkpm.bus_booking_api.features.statistic;

import com.dkpm.bus_booking_api.application.response.ApiResponse;
import com.dkpm.bus_booking_api.features.statistic.dto.DashboardStatisticResponse;
import com.dkpm.bus_booking_api.features.statistic.dto.TripStatisticResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/statistic")
@RequiredArgsConstructor
public class StatisticController {
    private final IStatisticService statisticService;
    @GetMapping
    public ResponseEntity<ApiResponse<DashboardStatisticResponse>> getStatistics(){
        DashboardStatisticResponse result = statisticService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/routes/tracking")
    public ResponseEntity<ApiResponse<TripStatisticResponse>> getTripStatistics(){
        TripStatisticResponse response = statisticService.getStatisticsByTrip();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
