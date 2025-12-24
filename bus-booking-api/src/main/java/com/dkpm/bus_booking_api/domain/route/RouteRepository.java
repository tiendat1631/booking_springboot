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

        Optional<Route> findByCode(String code);

        boolean existsByCode(String code);

        Page<Route> findByActiveTrueAndDeletedFalse(Pageable pageable);

        @Query("""
                        SELECT r FROM Route r
                        JOIN FETCH r.departureStation ds
                        JOIN FETCH r.arrivalStation as
                        WHERE r.active = true
                        AND r.deleted = false
                        AND (:keyword IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                            OR LOWER(r.code) LIKE LOWER(CONCAT('%', :keyword, '%')))
                        """)
        Page<Route> searchRoutes(@Param("keyword") String keyword, Pageable pageable);

        @Query("""
                        SELECT r FROM Route r
                        JOIN FETCH r.departureStation ds
                        JOIN FETCH r.arrivalStation as
                        WHERE r.active = true
                        AND r.deleted = false
                        AND ds.id = :departureStationId
                        AND as.id = :arrivalStationId
                        """)
        Page<Route> findByStations(
                        @Param("departureStationId") UUID departureStationId,
                        @Param("arrivalStationId") UUID arrivalStationId,
                        Pageable pageable);

        @Query("""
                        SELECT r FROM Route r
                        JOIN FETCH r.departureStation ds
                        JOIN FETCH r.arrivalStation as
                        WHERE r.active = true
                        AND r.deleted = false
                        AND (ds.id = :stationId OR as.id = :stationId)
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
