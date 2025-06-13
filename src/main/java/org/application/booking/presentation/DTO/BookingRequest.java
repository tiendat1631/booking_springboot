package org.application.booking.presentation.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter

public class BookingRequest {
    private UUID userId;
    private List<UUID> seatIds;
    private UUID tripId;
}
