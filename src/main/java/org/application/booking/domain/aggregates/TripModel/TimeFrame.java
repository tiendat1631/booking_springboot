package org.application.booking.domain.aggregates.TripModel;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Embeddable
@Getter
@Setter

public class TimeFrame {
    private LocalDateTime start;
    private LocalDateTime end;
    public TimeFrame() {}

    public TimeFrame(LocalDateTime start, LocalDateTime end) {
        if (start==null || end==null || start.isAfter(end)) {
            throw new IllegalArgumentException("Start and end time must be greater than or equal to end time, and both must be not null.");
        }
        this.start = start;
        this.end = end;
    }

    @Override
    public String toString() {
        return start.toString() + " - " + end.toString();
    }
}
