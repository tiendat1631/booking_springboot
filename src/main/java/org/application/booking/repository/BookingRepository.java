package org.application.booking.repository;

import org.application.booking.domain.aggregates.BookingModel.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByUserId(UUID userId);
    //Optional<Booking> findByBookingCodeAndUser_PhoneNum(String bookingCode, String phoneNum);
}
