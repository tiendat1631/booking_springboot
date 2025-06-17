package org.application.booking.domain.entity.Booking;


import jakarta.persistence.*;
import org.application.booking.domain.entity.BaseEntity;
import org.application.booking.domain.entity.Ticket;
import org.application.booking.domain.entity.Trip;
import org.application.booking.domain.entity.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.function.ToDoubleBiFunction;

@Entity
public class Booking extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id")
    private Trip trip;

    private float total;
    private LocalDateTime timeCreate;

    @OneToMany(mappedBy = "booking", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookedTicket> bookedTickets;

    private Booking() {}

    private Booking(User user, Trip trip, LocalDateTime timeCreate){
        this.user = user;
        this.trip = trip;
        this.timeCreate = timeCreate;
        this.bookedTickets = new ArrayList<>();
    }

    public static Booking Create(User user, Trip trip, LocalDateTime timeCreate, List<Ticket> tickets){
        Booking booking = new Booking(user, trip, timeCreate);

        for(Ticket ticket : tickets){
            booking.AddTicket(ticket);
        }

        booking.total = trip.getPricePerSeat() * tickets.size();

        return booking;
    }

    public void AddTicket(Ticket ticket){
        if(ticket.isOccupied()) {
            throw new IllegalArgumentException("This seat has already taken");
        }else{
            bookedTickets.add(new BookedTicket(ticket, this));
            ticket.occupy();
        }
    }

    private void setTotal(float total){
        this.total = total;
    }


}

