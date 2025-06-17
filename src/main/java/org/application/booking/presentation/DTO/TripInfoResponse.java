package org.application.booking.presentation.DTO;

import org.application.booking.domain.ValueObject.TimeFrame;
import org.application.booking.domain.entity.BusBoundary.BusType;

import java.util.UUID;

public class TripInfoResponse {
    private BusType busType;
    private float totalPrice;
    private String departure;
    private String destination;
    private TimeFrame departureTime;
    private TimeFrame arrivalTime;
}
