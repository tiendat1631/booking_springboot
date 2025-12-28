package com.dkpm.bus_booking_api.domain.station;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StationRepository extends JpaRepository<Station, UUID> {

        @Query("""
                        SELECT s FROM Station s
                        WHERE s.deleted = false
                        AND (:isActive IS NULL OR s.active = :isActive)
                        AND (:name IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%')))
                        AND (:province IS NULL OR LOWER(s.province.codename) LIKE LOWER(CONCAT('%', :province, '%')))
                        """)
        Page<Station> searchStations(
                        @Param("name") String name,
                        @Param("province") String province,
                        @Param("isActive") Boolean isActive,
                        Pageable pageable);
}
