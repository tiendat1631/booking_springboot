package org.application.booking.domain.aggregates.BookingModel;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.aggregates.TripModel.Ticket;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.domain.aggregates.UserModel.User;
import org.application.booking.domain.common.BaseEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Entity
public class Booking extends BaseEntity {

    // ====== Người đặt ======
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Column(name = "user_id", insertable = false, updatable = false)
    private UUID userId;

    // ====== Chuyến đi ======
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id")
    @JsonIgnore
    private Trip trip;

    @Column(name = "trip_id", insertable = false, updatable = false)
    private UUID tripId;

    // ====== Thông tin khác ======
    private float total;
    private LocalDateTime timeCreate;

    @OneToMany(mappedBy = "booking", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<BookedTicket> bookedTickets;

    // ====== Constructors ======
    protected Booking() {}

    private Booking(User user, Trip trip, LocalDateTime timeCreate) {
        this.user = user;
        this.trip = trip;
        this.timeCreate = timeCreate;
        this.bookedTickets = new ArrayList<>();
    }

    public static Booking Create(User user, Trip trip, LocalDateTime timeCreate, List<Ticket> tickets) {
        Booking booking = new Booking(user, trip, timeCreate);
        for (Ticket ticket : tickets) {
            booking.AddTicket(ticket);
        }
        booking.total = trip.getPricePerSeat() * tickets.size();
        return booking;
    }

    // ====== Logic đặt vé ======
    public void AddTicket(Ticket ticket) {
        if (ticket.isOccupied()) {
            throw new IllegalArgumentException("This seat has already been taken");
        } else {
            bookedTickets.add(new BookedTicket(ticket, this));
            ticket.occupy();
        }
    }

    // ====== Setters cho cập nhật ======

    public void setTotal(float total) {
        this.total = total;
    }

    public void setTripId(UUID tripId) {
        this.tripId = tripId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}
