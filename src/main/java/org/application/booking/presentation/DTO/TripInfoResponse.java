package org.application.booking.presentation.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.aggregates.BusModel.BusType;


@Getter
@Setter
@AllArgsConstructor
public class TripInfoResponse {
    private BusType busType;
    private float price;
    private String departure;
    private String destination;
    private String time;
    private int availableSeats;
}
