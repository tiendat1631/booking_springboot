package org.application.booking.domain.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.entity.BusBoundary.Seat;

@Entity
@Table(name = "ticket")
@Getter
@Setter
public class Ticket extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "seat_id", nullable = false)
    @JsonIgnore
    private Seat seat;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    private boolean isOccupied;
    public Ticket() {}
    public Ticket(Seat seat, Trip trip) {
        this.seat = seat;
        this.trip = trip;
        this.isOccupied = false;
    }
}
