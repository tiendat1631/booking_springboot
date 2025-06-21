package org.application.booking.domain.aggregates.TripModel;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;


@Embeddable
@Getter
@Setter
@RequiredArgsConstructor
public class TimeFrame {
    private String start;
    private String end;
}
