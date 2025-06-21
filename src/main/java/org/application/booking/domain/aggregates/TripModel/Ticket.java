package org.application.booking.domain.aggregates.TripModel;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.common.BaseEntity;
import org.application.booking.domain.aggregates.BusModel.Seat;

import java.util.UUID;

@Entity
@Table(name = "ticket")
@Getter
@Setter
public class Ticket extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id")
    @JsonIgnore
    private Seat seat;

    @Column(name = "seat_id", insertable = false, updatable = false)
    private UUID seatId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id")
    @JsonBackReference
    private Trip trip;

    private boolean isOccupied;
    public Ticket() {}
    public Ticket(Seat seat, Trip trip) {
        this.seat = seat;
        this.trip = trip;
        this.isOccupied = false;
    }

    public void occupy() {
        this.isOccupied = true;
    }

    public void release() {
        this.isOccupied = false;
    }
}
