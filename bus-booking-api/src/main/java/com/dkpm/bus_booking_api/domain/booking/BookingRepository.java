package com.dkpm.bus_booking_api.domain.booking;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    /**
     * Find booking by booking code
     */
    Optional<Booking> findByBookingCode(String bookingCode);

    /**
     * Check if booking code exists
     */
    boolean existsByBookingCode(String bookingCode);

    /**
     * Find booking with all details
     */
    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.trip t
            JOIN FETCH t.route r
            JOIN FETCH r.departureStation
            JOIN FETCH r.arrivalStation
            JOIN FETCH t.bus
            LEFT JOIN FETCH b.details
            LEFT JOIN FETCH b.payment
            WHERE b.id = :id
            AND b.deleted = false
            """)
    Optional<Booking> findByIdWithDetails(@Param("id") UUID id);

    /**
     * Find booking by code with details
     */
    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.trip t
            JOIN FETCH t.route r
            JOIN FETCH r.departureStation
            JOIN FETCH r.arrivalStation
            JOIN FETCH t.bus
            LEFT JOIN FETCH b.details
            LEFT JOIN FETCH b.payment
            WHERE b.bookingCode = :bookingCode
            AND b.deleted = false
            """)
    Optional<Booking> findByBookingCodeWithDetails(@Param("bookingCode") String bookingCode);

    /**
     * Find bookings by customer
     */
    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.trip t
            JOIN FETCH t.route r
            JOIN FETCH r.departureStation
            JOIN FETCH r.arrivalStation
            WHERE b.customer.id = :customerId
            AND b.deleted = false
            ORDER BY b.bookingTime DESC
            """)
    Page<Booking> findByCustomerId(@Param("customerId") UUID customerId, Pageable pageable);

    /**
     * Find bookings by trip
     */
    @Query("""
            SELECT b FROM Booking b
            WHERE b.trip.id = :tripId
            AND b.deleted = false
            AND b.status IN ('PENDING', 'CONFIRMED')
            """)
    List<Booking> findActiveBookingsByTripId(@Param("tripId") UUID tripId);

    /**
     * Find expired pending bookings for cleanup
     */
    @Query("""
            SELECT b FROM Booking b
            LEFT JOIN FETCH b.details
            WHERE b.status = 'PENDING'
            AND b.expiryTime < :now
            AND b.deleted = false
            """)
    List<Booking> findExpiredPendingBookings(@Param("now") LocalDateTime now);

    /**
     * Search bookings (admin)
     */
    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.trip t
            JOIN FETCH t.route r
            JOIN FETCH r.departureStation
            JOIN FETCH r.arrivalStation
            WHERE b.deleted = false
            AND (:status IS NULL OR b.status = :status)
            AND (:keyword IS NULL OR
                LOWER(b.bookingCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                LOWER(b.passengerName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                LOWER(b.passengerPhone) LIKE LOWER(CONCAT('%', :keyword, '%')))
            ORDER BY b.bookingTime DESC
            """)
    Page<Booking> searchBookings(
            @Param("status") BookingStatus status,
            @Param("keyword") String keyword,
            Pageable pageable);

    /**
     * Count bookings by status for a date range
     */
    @Query("""
            SELECT COUNT(b) FROM Booking b
            WHERE b.status = :status
            AND b.bookingTime >= :startTime
            AND b.bookingTime < :endTime
            AND b.deleted = false
            """)
    long countByStatusAndDateRange(
            @Param("status") BookingStatus status,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}
