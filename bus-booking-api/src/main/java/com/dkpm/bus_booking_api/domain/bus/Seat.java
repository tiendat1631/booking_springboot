package com.dkpm.bus_booking_api.domain.bus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seat {
    private String seatId;
    private int row;
    private int col;
    private boolean isActive;
}
