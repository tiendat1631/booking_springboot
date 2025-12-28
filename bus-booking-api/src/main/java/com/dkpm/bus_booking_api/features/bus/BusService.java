package com.dkpm.bus_booking_api.features.bus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.dkpm.bus_booking_api.domain.bus.Bus;
import com.dkpm.bus_booking_api.domain.bus.BusRepository;
import com.dkpm.bus_booking_api.domain.bus.BusStatus;
import com.dkpm.bus_booking_api.domain.bus.BusType;
import com.dkpm.bus_booking_api.domain.bus.Seat;
import com.dkpm.bus_booking_api.domain.bus.SeatLayout;
import com.dkpm.bus_booking_api.domain.exception.ResourceNotFoundException;
import com.dkpm.bus_booking_api.features.bus.dto.BusDetailResponse;
import com.dkpm.bus_booking_api.features.bus.dto.BusSummaryResponse;

import lombok.RequiredArgsConstructor;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BusService implements IBusService {

    private final BusRepository busRepository;

    /**
     * SEARCH BUSES WITH FILTERS
     */
    @Override
    public Page<BusSummaryResponse> searchBuses(String licensePlate, BusType type, BusStatus status,
            Integer minSeats, Integer maxSeats, Pageable pageable) {

        return busRepository.searchBusSummaries(licensePlate, type, status, minSeats, maxSeats, pageable);
    }

    /**
     * GET BUS DETAIL BY ID
     */
    @Override
    public BusDetailResponse getBusDetail(UUID id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + id));

        return BusDetailResponse.from(bus);
    }

    /**
     * CREATE BUS BASED ON TYPE
     */
    @Override
    public Bus createBus(String licensePlate, BusType type) {
        switch (type) {
            case SEATER:
                return createSeaterBus(licensePlate);
            case SLEEPER:
                return createSleeperBus(licensePlate);
            case LIMOUSINE:
                return createLimousineBus(licensePlate);
            default:
                throw new IllegalArgumentException("Invalid Bus Type: " + type);
        }
    }

    /**
     * CREATE SEATER BUS (45 Seats)
     * Layout: 4 columns (2 Left - 2 Right)
     */
    @Override
    public Bus createSeaterBus(String licensePlate) {
        Bus bus = new Bus();
        bus.setLicensePlate(licensePlate);
        bus.setType(BusType.SEATER);
        bus.setStatus(BusStatus.ACTIVE);

        int totalRows = 11;
        int totalCols = 4;

        SeatLayout layout = new SeatLayout();
        layout.setTotalRows(totalRows);
        layout.setTotalColumns(totalCols);

        List<Seat> seats = new ArrayList<>();

        for (int row = 1; row <= totalRows; row++) {
            for (int col = 1; col <= totalCols; col++) {
                Seat seat = new Seat();
                String seatLabel = String.format("%02d", (row - 1) * 4 + col); // 01, 02...

                seat.setSeatId("S" + seatLabel); // S01, S02...
                seat.setRow(row);
                seat.setCol(col);
                seat.setActive(true);

                seats.add(seat);
            }
        }

        layout.setSeats(seats);
        bus.setSeatLayout(layout);
        bus.setTotalSeats(seats.size());

        return busRepository.save(bus);
    }

    /**
     * CREATE SLEEPER BUS (40 Seats)
     * Layout: 3 Columns (Left, Mid, Right)
     * ID: 'A' for lower deck and 'B' for upper deck
     */
    @Override
    public Bus createSleeperBus(String licensePlate) {
        Bus bus = new Bus();
        bus.setLicensePlate(licensePlate);
        bus.setType(BusType.SLEEPER);
        bus.setStatus(BusStatus.ACTIVE);

        int totalRows = 12;
        int totalCols = 3;

        SeatLayout layout = new SeatLayout();
        layout.setTotalRows(totalRows);
        layout.setTotalColumns(totalCols);

        List<Seat> seats = new ArrayList<>();

        for (int row = 1; row <= totalRows; row++) {
            for (int col = 1; col <= totalCols; col++) {
                Seat seat = new Seat();

                // A = Lower (Row 1-6), B = Upper (Row 7-12)
                String floorPrefix = (row <= 6) ? "A" : "B";
                // Reset row number for label (1-6)
                int labelRow = (row <= 6) ? row : (row - 6);

                // A01, A02, A03... B01...
                String seatLabel = String.format("%s%02d", floorPrefix, ((labelRow - 1) * 3 + col));

                seat.setSeatId(seatLabel);
                seat.setRow(row);
                seat.setCol(col);
                seat.setActive(true);

                seats.add(seat);
            }
        }

        layout.setSeats(seats);
        bus.setSeatLayout(layout);
        bus.setTotalSeats(seats.size());

        return busRepository.save(bus);
    }

    /**
     * CREATE LIMOUSINE BUS (22 Seats)
     * Layout: 2 Columns (1 Left - 1 Right)
     * Let's do a 22-room VIP (Double decker style implies 11 rows x 2 cols).
     */
    @Override
    public Bus createLimousineBus(String licensePlate) {
        Bus bus = new Bus();
        bus.setLicensePlate(licensePlate);
        bus.setType(BusType.LIMOUSINE);
        bus.setStatus(BusStatus.ACTIVE);

        int totalRows = 11;
        int totalCols = 2;

        SeatLayout layout = new SeatLayout();
        layout.setTotalRows(totalRows);
        layout.setTotalColumns(totalCols);

        List<Seat> seats = new ArrayList<>();

        for (int row = 1; row <= totalRows; row++) {
            for (int col = 1; col <= totalCols; col++) {
                Seat seat = new Seat();

                // C01, C02...
                String seatLabel = "C" + String.format("%02d", ((row - 1) * 2 + col));

                seat.setSeatId(seatLabel);
                seat.setRow(row);
                seat.setCol(col);
                seat.setActive(true);

                seats.add(seat);
            }
        }

        layout.setSeats(seats);
        bus.setSeatLayout(layout);
        bus.setTotalSeats(seats.size());

        return busRepository.save(bus);
    }
}