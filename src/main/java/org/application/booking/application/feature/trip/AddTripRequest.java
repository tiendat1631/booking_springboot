package org.application.booking.application.feature.trip;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.aggregates.TripModel.TimeFrame;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class AddTripRequest {
    @NotBlank
    private String departure;
    @NotBlank
    private String destination;
    @NotNull
    @Positive
    private float price;
    @NotNull
    private TimeFrame timeFrame;
    @NotNull
    private List<UUID> busIds; // Danh sách ID bus được thêm vào trip
}
