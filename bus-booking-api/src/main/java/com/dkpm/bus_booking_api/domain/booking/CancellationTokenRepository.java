package com.dkpm.bus_booking_api.domain.booking;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CancellationTokenRepository extends JpaRepository<CancellationToken, UUID> {

    /**
     * Find token by booking ID
     */
    Optional<CancellationToken> findByBookingId(UUID bookingId);

    /**
     * Find token by booking code
     */
    @Query("SELECT ct FROM CancellationToken ct WHERE ct.booking.bookingCode = :bookingCode")
    Optional<CancellationToken> findByBookingCode(@Param("bookingCode") String bookingCode);

    /**
     * Delete token by booking ID
     */
    @Modifying
    void deleteByBookingId(UUID bookingId);

    /**
     * Check if token exists for booking
     */
    boolean existsByBookingId(UUID bookingId);
}
