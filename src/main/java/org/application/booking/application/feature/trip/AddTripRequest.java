package org.application.booking.application.feature.trip;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.ValueObject.TimeFrame;

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
    @NotBlank
    private String timeFrame;
    @NotNull
    private UUID busId;
}
