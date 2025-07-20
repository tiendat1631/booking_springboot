package org.application.booking.application.feature.bus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.aggregates.BusModel.BusType;

@Getter
@Setter
public class UpdateBusRequest {
    @NotNull
    private BusType type;
}
