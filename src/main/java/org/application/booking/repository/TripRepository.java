package org.application.booking.repository;

import org.application.booking.domain.aggregates.TripModel.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.time.LocalDateTime;
import java.util.UUID;

public interface TripRepository extends JpaRepository<Trip, UUID>, JpaSpecificationExecutor<Trip> {
    @Query("""
        SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END
        FROM Trip t
        WHERE t.bus.id = :busId
          AND (
                (t.departureTime < :estimatedArrivalTime AND t.estimatedArrivalTime > :departureTime)
              )
    """)
    boolean isBusBusyDuring(
            @Param("departureTime") LocalDateTime departureTime,
            @Param("estimatedArrivalTime") LocalDateTime estimatedArrivalTime,
            @Param("busId") UUID busId
    );
}
