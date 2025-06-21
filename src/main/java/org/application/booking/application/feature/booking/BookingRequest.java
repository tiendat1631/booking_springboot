package org.application.booking.application.feature.booking;

import jakarta.persistence.JoinColumn;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.entity.Ticket;



import java.util.Date;
import java.util.List;
import java.util.UUID;


@Getter
@Setter
public class BookingRequest {

    private UUID userId;
    private List<Ticket> tickets;
    private UUID tripId;
    private Date date;

}
