package org.application.booking.application.feature.bus;

import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.entity.BusBoundary.BusType;
@Getter
@Setter
public class AddBusRequest {
    public int numberOfSeats;
    public BusType busType;

}
