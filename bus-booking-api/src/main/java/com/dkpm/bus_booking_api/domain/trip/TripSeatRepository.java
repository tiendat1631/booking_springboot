package com.dkpm.bus_booking_api.domain.trip;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;

@Repository
public interface TripSeatRepository extends JpaRepository<TripSeat, UUID> {

        /**
         * Find all seats for a trip
         */
        @Query("""
                        SELECT ts FROM TripSeat ts
                        WHERE ts.trip.id = :tripId
                        AND ts.deleted = false
                        ORDER BY ts.row ASC, ts.col ASC
                        """)
        List<TripSeat> findByTripId(@Param("tripId") UUID tripId);

        /**
         * Find available seats for a trip
         */
        @Query("""
                        SELECT ts FROM TripSeat ts
                        WHERE ts.trip.id = :tripId
                        AND ts.status = 'AVAILABLE'
                        AND ts.deleted = false
                        ORDER BY ts.row ASC, ts.col ASC
                        """)
        List<TripSeat> findAvailableSeatsByTripId(@Param("tripId") UUID tripId);

        /**
         * Find specific seats by IDs with pessimistic lock (for booking)
         */
        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("""
                        SELECT ts FROM TripSeat ts
                        WHERE ts.trip.id = :tripId
                        AND ts.seatId IN :seatIds
                        AND ts.deleted = false
                        """)
        List<TripSeat> findAndLockByTripIdAndSeatIds(
                        @Param("tripId") UUID tripId,
                        @Param("seatIds") List<String> seatIds);

        /**
         * Find a specific seat
         */
        @Query("""
                        SELECT ts FROM TripSeat ts
                        WHERE ts.trip.id = :tripId
                        AND ts.seatId = :seatId
                        AND ts.deleted = false
                        """)
        Optional<TripSeat> findByTripIdAndSeatId(
                        @Param("tripId") UUID tripId,
                        @Param("seatId") String seatId);

        /**
         * Count available seats for a trip
         */
        @Query("""
                        SELECT COUNT(ts) FROM TripSeat ts
                        WHERE ts.trip.id = :tripId
                        AND ts.status = 'AVAILABLE'
                        AND ts.deleted = false
                        """)
        int countAvailableSeatsByTripId(@Param("tripId") UUID tripId);

        /**
         * Find reserved seats that have expired (for cleanup)
         */
        @Query("""
                        SELECT ts FROM TripSeat ts
                        WHERE ts.status = 'RESERVED'
                        AND ts.updatedAt < :expiryTime
                        AND ts.deleted = false
                        """)
        List<TripSeat> findExpiredReservedSeats(@Param("expiryTime") java.time.LocalDateTime expiryTime);
}
