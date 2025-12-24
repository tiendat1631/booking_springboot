package com.dkpm.bus_booking_api.domain.station;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StationRepository extends JpaRepository<Station, UUID> {

    Optional<Station> findByCode(String code);

    boolean existsByCode(String code);

    Page<Station> findByActiveTrueAndDeletedFalse(Pageable pageable);

    @Query("""
            SELECT s FROM Station s
            WHERE s.active = true
            AND s.deleted = false
            AND (:keyword IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(s.code) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(s.city) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    Page<Station> searchStations(@Param("keyword") String keyword, Pageable pageable);

    @Query("""
            SELECT s FROM Station s
            WHERE s.active = true
            AND s.deleted = false
            AND LOWER(s.city) = LOWER(:city)
            """)
    Page<Station> findByCity(@Param("city") String city, Pageable pageable);

    @Query("""
            SELECT s FROM Station s
            WHERE s.active = true
            AND s.deleted = false
            AND LOWER(s.province) = LOWER(:province)
            """)
    Page<Station> findByProvince(@Param("province") String province, Pageable pageable);
}
