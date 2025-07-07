package org.application.booking.application.feature.booking;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter

@NoArgsConstructor
public class CreateBookingRequest {
    public UUID tripId;
    public List<UUID> seatIds;
    public UUID userId;

    public <E> CreateBookingRequest(UUID tripId, List<UUID> seatIds, UUID userId) {
        this.tripId = tripId;
        this.seatIds = seatIds;
        this.userId = userId;
    }
}
