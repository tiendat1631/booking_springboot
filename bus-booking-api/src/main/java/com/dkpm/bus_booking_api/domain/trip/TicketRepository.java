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
public interface TicketRepository extends JpaRepository<Ticket, UUID> {

        @Query("SELECT t FROM Ticket t WHERE t.trip.id = :tripId ORDER BY t.row, t.col")
        List<Ticket> findByTripId(@Param("tripId") UUID tripId);

        @Query("SELECT t FROM Ticket t WHERE t.trip.id = :tripId AND t.seatId = :seatId")
        Optional<Ticket> findByTripIdAndSeatId(
                        @Param("tripId") UUID tripId,
                        @Param("seatId") String seatId);

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("SELECT t FROM Ticket t WHERE t.id IN :ids")
        List<Ticket> findByIdsWithLock(@Param("ids") List<UUID> ids);

        @Query("SELECT t FROM Ticket t WHERE t.trip.id = :tripId AND t.status = 'AVAILABLE'")
        List<Ticket> findAvailableByTripId(@Param("tripId") UUID tripId);

        @Query("SELECT COUNT(t) FROM Ticket t WHERE t.trip.id = :tripId AND t.status = 'AVAILABLE'")
        int countAvailableByTripId(@Param("tripId") UUID tripId);

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("SELECT t FROM Ticket t WHERE t.trip.id = :tripId AND t.seatId IN :seatIds")
        List<Ticket> findAndLockByTripIdAndSeatIds(
                        @Param("tripId") UUID tripId,
                        @Param("seatIds") List<String> seatIds);
}
