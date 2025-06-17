package org.application.booking.application.feature.booking;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CreateBookingRequest {
    public UUID tripId;
    public List<UUID> seatIds;
    public UUID userId;
}
