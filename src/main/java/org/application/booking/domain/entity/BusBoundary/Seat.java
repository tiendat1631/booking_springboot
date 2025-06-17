package org.application.booking.domain.entity.BusBoundary;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.entity.BaseEntity;
//import org.application.booking.domain.entity.Booking.Booking;

@Getter
@Setter
@Entity

public class Seat extends BaseEntity {
    @ManyToOne
    @JoinColumn(name="bus_id")
    private Bus bus;
    public Seat(Bus bus) {
        this.bus = bus;
    }

    public Seat() {

    }
}
