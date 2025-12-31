package com.dkpm.bus_booking_api.features.bus;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dkpm.bus_booking_api.domain.bus.Bus;
import com.dkpm.bus_booking_api.domain.bus.BusStatus;
import com.dkpm.bus_booking_api.domain.bus.BusType;
import com.dkpm.bus_booking_api.features.bus.dto.BusDetailResponse;
import com.dkpm.bus_booking_api.features.bus.dto.BusSummaryResponse;

public interface IBusService {

    /**
     * SEARCH BUSES WITH FILTERS AND PAGINATION
     */
    Page<BusSummaryResponse> searchBuses(String licensePlate, List<BusType> types, List<BusStatus> statuses,
            Integer minSeats, Integer maxSeats, Pageable pageable);

    /**
     * GET BUS DETAIL BY ID
     */
    BusDetailResponse getBusDetail(UUID id);

    /**
     * GET ALL ACTIVE BUSES
     */
    List<BusSummaryResponse> getActiveBuses();

    /**
     * CREATE GENERIC BUS
     */
    Bus createBus(String licensePlate, BusType type);

    /**
     * CREATE SEATER BUS (45 Seats)
     * Layout: 4 columns (2 Left - 2 Right)
     */
    Bus createSeaterBus(String licensePlate);

    /**
     * CREATE SLEEPER BUS (40 Seats)
     * Layout: 3 Columns (Left, Mid, Right)
     * ID: 'A' for lower deck and 'B' for upper deck
     */
    Bus createSleeperBus(String licensePlate);

    /**
     * CREATE LIMOUSINE BUS (22 Seats)
     * Layout: 2 Columns (1 Left - 1 Right)
     * Let's do a 22-room VIP (Double decker style implies 11 rows x 2 cols).
     */
    Bus createLimousineBus(String licensePlate);

}