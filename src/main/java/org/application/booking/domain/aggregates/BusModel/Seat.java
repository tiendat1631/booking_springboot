package org.application.booking.domain.aggregates.BusModel;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.common.BaseEntity;
//import org.application.booking.domain.entity.Booking.Booking;

@Getter
@Setter
@Entity
public class Seat extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="bus_id")
    @JsonBackReference
    private Bus bus;

    private int seatNum;

    public Seat(Bus bus, int seatNum) {
        this.bus = bus;
        this.seatNum = seatNum;
    }

    public Seat() {
    }
}
