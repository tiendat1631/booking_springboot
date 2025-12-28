package com.dkpm.bus_booking_api.domain.trip;

import java.time.LocalDate;
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
public interface TripRepository extends JpaRepository<Trip, UUID> {

    @Query("""
            SELECT t FROM Trip t
            JOIN FETCH t.route r
            JOIN FETCH r.departureStation
            JOIN FETCH r.arrivalStation
            JOIN FETCH t.bus b
            WHERE t.id = :id
            AND t.deleted = false
            """)
    Optional<Trip> findByIdWithDetails(@Param("id") UUID id);

    /**
     * Admin search trips with flexible filters
     */
    @Query("""
            SELECT t FROM Trip t
            JOIN FETCH t.route r
            JOIN FETCH r.departureStation ds
            JOIN FETCH r.arrivalStation ars
            JOIN FETCH t.bus b
            WHERE t.deleted = false
            AND (:status IS NULL OR t.status = :status)
            AND (:routeId IS NULL OR r.id = :routeId)
            AND (:busId IS NULL OR b.id = :busId)
            AND (:fromDate IS NULL OR t.departureTime >= :fromDate)
            AND (:toDate IS NULL OR t.departureTime < :toDate)

            AND (:route IS NULL OR (
                LOWER(r.name) LIKE LOWER(CONCAT('%', :route, '%')) OR
                LOWER(r.code) LIKE LOWER(CONCAT('%', :route, '%')) OR
                LOWER(ds.name) LIKE LOWER(CONCAT('%', :route, '%')) OR
                LOWER(ars.name) LIKE LOWER(CONCAT('%', :route, '%'))
            ))


            AND (:busLicensePlate IS NULL OR LOWER(b.licensePlate) LIKE LOWER(CONCAT('%', :busLicensePlate, '%')))
            """)
    Page<Trip> adminSearchTrips(
            @Param("status") TripStatus status,
            @Param("routeId") UUID routeId,
            @Param("busId") UUID busId,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("route") String route,
            @Param("busLicensePlate") String busLicensePlate,
            Pageable pageable);

    /**
     * Search trips for booking (main search API)
     */
    @Query("""
            SELECT t FROM Trip t
            JOIN FETCH t.route r
            JOIN FETCH r.departureStation ds
            JOIN FETCH r.arrivalStation as
            JOIN FETCH t.bus b
            WHERE t.deleted = false
            AND t.status = 'SCHEDULED'
            AND ds.id = :departureStationId
            AND as.id = :arrivalStationId
            AND CAST(t.departureTime AS LocalDate) = :departureDate
            AND t.availableSeats >= :requiredSeats
            ORDER BY t.departureTime ASC
            """)
    Page<Trip> searchAvailableTrips(
            @Param("departureStationId") UUID departureStationId,
            @Param("arrivalStationId") UUID arrivalStationId,
            @Param("departureDate") LocalDate departureDate,
            @Param("requiredSeats") int requiredSeats,
            Pageable pageable);

    /**
     * Find trips by route and date range
     */
    @Query("""
            SELECT t FROM Trip t
            JOIN FETCH t.route r
            JOIN FETCH r.departureStation
            JOIN FETCH r.arrivalStation
            JOIN FETCH t.bus
            WHERE t.deleted = false
            AND r.id = :routeId
            AND t.departureTime >= :startTime
            AND t.departureTime < :endTime
            ORDER BY t.departureTime ASC
            """)
    List<Trip> findByRouteAndDateRange(
            @Param("routeId") UUID routeId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    /**
     * Find trips by bus on a specific date
     */
    @Query("""
            SELECT t FROM Trip t
            WHERE t.deleted = false
            AND t.bus.id = :busId
            AND CAST(t.departureTime AS LocalDate) = :date
            """)
    List<Trip> findByBusAndDate(
            @Param("busId") UUID busId,
            @Param("date") LocalDate date);

    /**
     * Check for scheduling conflicts
     */
    @Query("""
            SELECT COUNT(t) > 0 FROM Trip t
            WHERE t.deleted = false
            AND t.bus.id = :busId
            AND t.status IN ('SCHEDULED', 'BOARDING', 'IN_TRANSIT')
            AND t.id != :excludeTripId
            AND (
                (t.departureTime <= :departureTime AND t.arrivalTime > :departureTime)
                OR (t.departureTime < :arrivalTime AND t.arrivalTime >= :arrivalTime)
                OR (t.departureTime >= :departureTime AND t.arrivalTime <= :arrivalTime)
            )
            """)
    boolean hasSchedulingConflict(
            @Param("busId") UUID busId,
            @Param("departureTime") LocalDateTime departureTime,
            @Param("arrivalTime") LocalDateTime arrivalTime,
            @Param("excludeTripId") UUID excludeTripId);

    /**
     * Find upcoming trips (for dashboard)
     */
    @Query("""
            SELECT t FROM Trip t
            JOIN FETCH t.route r
            JOIN FETCH r.departureStation
            JOIN FETCH r.arrivalStation
            JOIN FETCH t.bus
            WHERE t.deleted = false
            AND t.status = 'SCHEDULED'
            AND t.departureTime >= :now
            ORDER BY t.departureTime ASC
            """)
    Page<Trip> findUpcomingTrips(@Param("now") LocalDateTime now, Pageable pageable);
}
