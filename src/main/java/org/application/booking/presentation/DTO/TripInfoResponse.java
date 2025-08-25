package org.application.booking.presentation.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.aggregates.BusModel.BusType;

import java.util.List;
import java.util.UUID;


@Getter
@Setter
@AllArgsConstructor
public class TripInfoResponse {
    private UUID id;
    private String departureName;
    private String destinationName;

    private float ticketPrice;


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
