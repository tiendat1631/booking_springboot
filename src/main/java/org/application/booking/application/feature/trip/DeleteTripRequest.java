package org.application.booking.application.feature.trip;

import lombok.Getter;

import java.util.UUID;

@Getter
public class DeleteTripRequest {
    private UUID tripId;
}