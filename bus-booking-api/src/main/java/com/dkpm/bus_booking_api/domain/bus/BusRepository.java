package com.dkpm.bus_booking_api.domain.bus;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dkpm.bus_booking_api.features.bus.dto.BusSummaryResponse;

@Repository
public interface BusRepository extends JpaRepository<Bus, UUID> {
  @Query("""
          SELECT new com.dkpm.bus_booking_api.features.bus.dto.BusSummaryResponse(
              b.id,
              b.licensePlate,
              b.type,
              b.status,
              b.totalSeats,
              b.createdAt,
              b.updatedAt
          )
          FROM Bus b
          WHERE (:keyword IS NULL OR LOWER(b.licensePlate) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:type IS NULL OR b.type = :type)
            AND (:status IS NULL OR b.status = :status)
            AND (:minSeats IS NULL OR b.totalSeats >= :minSeats)
            AND (:maxSeats IS NULL OR b.totalSeats <= :maxSeats)
      """)
  Page<BusSummaryResponse> searchBusSummaries(
      @Param("keyword") String keyword,
      @Param("type") BusType type,
      @Param("status") BusStatus status,
      @Param("minSeats") Integer minSeats,
      @Param("maxSeats") Integer maxSeats,
      Pageable pageable);
}
