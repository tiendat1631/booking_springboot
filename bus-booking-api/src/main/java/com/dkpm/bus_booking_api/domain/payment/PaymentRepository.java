package com.dkpm.bus_booking_api.domain.payment;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    /**
     * Find payment by booking ID
     */
    Optional<Payment> findByBookingId(UUID bookingId);

    /**
     * Find payment by transaction ID
     */
    Optional<Payment> findByTransactionId(String transactionId);

    /**
     * Find payment by VNPay transaction reference
     */
    Optional<Payment> findByVnpayTxnRef(String vnpayTxnRef);

    /**
     * Find payment with booking details
     */
    @Query("""
            SELECT p FROM Payment p
            JOIN FETCH p.booking b
            JOIN FETCH b.trip t
            JOIN FETCH t.route r
            WHERE p.id = :id
            """)
    Optional<Payment> findByIdWithDetails(@Param("id") UUID id);

    /**
     * Find payment by booking with details
     */
    @Query("""
            SELECT p FROM Payment p
            JOIN FETCH p.booking b
            JOIN FETCH b.trip t
            WHERE p.booking.id = :bookingId
            """)
    Optional<Payment> findByBookingIdWithDetails(@Param("bookingId") UUID bookingId);
}
