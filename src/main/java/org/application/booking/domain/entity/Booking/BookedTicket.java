package org.application.booking.domain.entity.Booking;


import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.entity.BaseEntity;
import org.application.booking.domain.entity.Ticket;

@Entity
@Getter
@Setter
public class BookedTicket extends BaseEntity {
    @OneToOne
    private Ticket ticket;

    @ManyToOne
    private Booking booking;

    public BookedTicket(Ticket ticket, Booking booking){
        this.ticket = ticket;
        this.booking = booking;
    }

    protected BookedTicket() {}
}
