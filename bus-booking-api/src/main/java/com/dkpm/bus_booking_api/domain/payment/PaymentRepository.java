package com.dkpm.bus_booking_api.domain.payment;

import java.math.BigDecimal;
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

    @Query("""
    SELECT COALESCE(SUM(p.amount), 0)
    FROM Payment p
    WHERE p.status = 'COMPLETED'
""")
    BigDecimal getTotalRevenue();

    @Query("""
    SELECT COALESCE(SUM(p.amount), 0)
    FROM Payment p
    WHERE p.status = 'COMPLETED'
    AND DATE(p.paidAt) = CURRENT_DATE
""")
    BigDecimal getRevenueToday();

    @Query("""
    SELECT COALESCE(SUM(p.amount), 0)
    FROM Payment p
    WHERE p.status = 'COMPLETED'
    AND YEAR(p.paidAt) = YEAR(CURRENT_DATE)
    AND MONTH(p.paidAt) = MONTH(CURRENT_DATE)
""")
    BigDecimal getRevenueThisMonth();

    @Query("""
    SELECT COALESCE(SUM(p.amount), 0)
    FROM Payment p
    WHERE p.status = 'COMPLETED'
    AND YEAR(p.paidAt) = YEAR(CURRENT_DATE)
""")
    BigDecimal getRevenueThisYear();

    @Query("""
    SELECT COALESCE(SUM(p.amount), 0)
    FROM Payment p
    JOIN p.booking b
    JOIN b.trip t
    WHERE p.status = 'COMPLETED'
    AND t.deleted = false
""")
    BigDecimal getTotalRevenueByTrip();
}
