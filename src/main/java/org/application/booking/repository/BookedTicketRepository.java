package org.application.booking.repository;

import org.application.booking.domain.aggregates.BookingModel.BookedTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BookedTicketRepository extends JpaRepository<BookedTicket, UUID> {
    void deleteByBookingId(UUID bookingId);
}
