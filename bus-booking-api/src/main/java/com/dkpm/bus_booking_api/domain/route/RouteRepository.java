package com.dkpm.bus_booking_api.domain.route;

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
public interface RouteRepository extends JpaRepository<Route, UUID> {

        boolean existsByCode(String code);

        @Query("""
                        SELECT r FROM Route r
                        JOIN FETCH r.departureStation ds
                        JOIN FETCH r.arrivalStation ars
                        WHERE r.deleted = false
                        AND (:isActive IS NULL OR r.active = :isActive)
                        AND (:name IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :name, '%')))
                        AND (:code IS NULL OR LOWER(r.code) LIKE LOWER(CONCAT('%', :code, '%')))
                        AND (:departureStationId IS NULL OR ds.id = :departureStationId)
                        AND (:arrivalStationId IS NULL OR ars.id = :arrivalStationId)
                        """)
        Page<Route> searchRoutes(
                        @Param("name") String name,
                        @Param("code") String code,
                        @Param("departureStationId") UUID departureStationId,
                        @Param("arrivalStationId") UUID arrivalStationId,
                        @Param("isActive") Boolean isActive,
                        Pageable pageable);

        @Query("""
                        SELECT r FROM Route r
                        JOIN FETCH r.departureStation ds
                        JOIN FETCH r.arrivalStation ars
                        WHERE r.active = true
                        AND r.deleted = false
                        AND (ds.id = :stationId OR ars.id = :stationId)
                        """)
        List<Route> findRoutesConnectingStation(@Param("stationId") UUID stationId);

        @Query("""
                        SELECT r FROM Route r
                        JOIN FETCH r.departureStation
                        JOIN FETCH r.arrivalStation
                        WHERE r.id = :id
                        AND r.deleted = false
                        """)
        Optional<Route> findByIdWithStations(@Param("id") UUID id);
}
