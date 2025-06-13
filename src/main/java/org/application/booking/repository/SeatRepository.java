package org.application.booking.repository;

import org.application.booking.domain.entity.BusBoundary.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface SeatRepository extends JpaRepository<Seat, UUID> {

    List<Seat> findAllByIdIn(List<UUID> seatIds);
}
