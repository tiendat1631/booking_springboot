package org.application.booking.domain.aggregates.BookingModel;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.common.BaseEntity;
import org.application.booking.domain.aggregates.TripModel.Ticket;

import java.util.UUID;

@Entity
@Getter
@Setter
public class BookedTicket extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;

    @Column(name = "ticket_id", insertable = false, updatable = false)
    private UUID ticketId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    @JsonBackReference
    private Booking booking;

    public BookedTicket(Ticket ticket, Booking booking){
        this.ticket = ticket;
        this.booking = booking;
    }

    protected BookedTicket() {}
}
