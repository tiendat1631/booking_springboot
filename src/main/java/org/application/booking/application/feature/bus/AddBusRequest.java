package org.application.booking.application.feature.bus;

import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.aggregates.BusModel.BusType;
@Getter
@Setter
public class AddBusRequest {
    public BusType busType;

}
