package com.dkpm.bus_booking_api.domain.bus;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatLayout {
    private int totalColumns;
    private int totalRows;
    private List<Seat> seats;
}
