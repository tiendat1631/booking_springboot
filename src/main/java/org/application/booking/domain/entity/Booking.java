/*
package org.application.booking.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.application.booking.domain.entity.BusBoundary.Seat;

import java.time.LocalDate;
import java.util.List;

@Table(name = "Booking")
@Getter
@Setter
@Entity
@RequiredArgsConstructor
public class Booking extends BaseEntity {
    private float totalPrice;
    private LocalDate timeCreate;

    @OneToMany(mappedBy = "booking",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ticket> tickets; // 1 booking biet dc ds cac ticket

    @ManyToOne
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Booking (float totalPrice, LocalDate timeCreate, List<Ticket> tickets, Trip trip, User user) {
        this.totalPrice = totalPrice;
        this.timeCreate = timeCreate;
        this.tickets = tickets;
        this.trip = trip;
        this.user = user;
    }
    public Booking(){}
    public void addticket(Ticket ticket) {
        this.tickets.add(ticket);
    }

}
*/
