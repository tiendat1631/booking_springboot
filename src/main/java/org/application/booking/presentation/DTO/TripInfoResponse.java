package org.application.booking.presentation.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.aggregates.BusModel.BusType;
import org.application.booking.domain.aggregates.TripModel.TimeFrame;

import java.util.List;
import java.util.UUID;


@Getter
@Setter
@AllArgsConstructor
public class TripInfoResponse {
    private UUID tripId;
    private float price;
    private String departure;
    private String destination;
    private TimeFrame time;
    private List<BusInfo> buses;

    @Getter
    @Setter
    public static class BusInfo {
        private UUID id;
        private BusType busType;
        private int availableSeats;

        public BusInfo(UUID id, BusType type, int availableSeats) {
            this.id = id;
            this.busType = type;
            this.availableSeats = availableSeats;

        }
    }
}
