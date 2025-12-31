package com.dkpm.bus_booking_api.domain.trip;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dkpm.bus_booking_api.domain.bus.BusType;

@Repository
public interface TripRepository extends JpaRepository<Trip, UUID> {

        /**
         * Admin search trips with flexible filters
         */
        @Query("""
                        SELECT t FROM Trip t
                        JOIN FETCH t.route r
                        JOIN FETCH t.departureStation ds
                        JOIN FETCH t.destinationStation ars
                        JOIN FETCH t.bus b
                        WHERE t.deleted = false
                        AND (:statuses IS NULL OR t.status IN :statuses)
                        AND (:busTypes IS NULL OR b.type IN :busTypes)
                        AND (:routeCode IS NULL OR LOWER(r.code) = LOWER(:routeCode))
                        AND (:busLicensePlate IS NULL OR LOWER(b.licensePlate) LIKE LOWER(CONCAT('%', :busLicensePlate, '%')))
                        AND (:departureStation IS NULL OR LOWER(ds.name) LIKE LOWER(CONCAT('%', :departureStation, '%')))
                        AND (:destinationStation IS NULL OR LOWER(ars.name) LIKE LOWER(CONCAT('%', :destinationStation, '%')))
                        AND (:fromDate IS NULL OR t.departureTime >= :fromDate)
                        AND (:toDate IS NULL OR t.departureTime < :toDate)
                        """)
        Page<Trip> adminSearchTrips(
                        @Param("statuses") List<TripStatus> statuses,
                        @Param("busTypes") List<BusType> busTypes,
                        @Param("routeCode") String routeCode,
                        @Param("busLicensePlate") String busLicensePlate,
                        @Param("departureStation") String departureStation,
                        @Param("destinationStation") String destinationStation,
                        @Param("fromDate") LocalDateTime fromDate,
                        @Param("toDate") LocalDateTime toDate,
                        Pageable pageable);

        /**
         * Search trips for booking (main search API) - by station ID
         */
        @Query("""
                        SELECT t FROM Trip t
                        JOIN FETCH t.route r
                        JOIN FETCH t.departureStation ds
                        JOIN FETCH t.destinationStation ars
                        JOIN FETCH t.bus b
                        WHERE t.deleted = false
                        AND t.status = 'SCHEDULED'
                        AND ds.id = :departureStationId
                        AND ars.id = :destinationStationId
                        AND CAST(t.departureTime AS LocalDate) = :departureDate
                        AND t.availableSeats >= :requiredSeats
                        ORDER BY t.departureTime ASC
                        """)
        Page<Trip> searchAvailableTrips(
                        @Param("departureStationId") UUID departureStationId,
                        @Param("destinationStationId") UUID destinationStationId,
                        @Param("departureDate") LocalDate departureDate,
                        @Param("requiredSeats") int requiredSeats,
                        Pageable pageable);

        /**
         * Search trips by province codename (public search API)
         */
        @Query("""
                        SELECT t FROM Trip t
                        JOIN FETCH t.route r
                        JOIN FETCH t.departureStation ds
                        JOIN FETCH t.destinationStation ars
                        JOIN FETCH t.bus b
                        WHERE t.deleted = false
                        AND t.status = 'SCHEDULED'
                        AND ds.province.codename = :departureProvince
                        AND ars.province.codename = :destinationProvince
                        AND CAST(t.departureTime AS LocalDate) = :departureDate
                        AND t.availableSeats >= :requiredSeats
                        ORDER BY t.departureTime ASC
                        """)
        Page<Trip> searchTripsByProvince(
                        @Param("departureProvince") String departureProvince,
                        @Param("destinationProvince") String destinationProvince,
                        @Param("departureDate") LocalDate departureDate,
                        @Param("requiredSeats") int requiredSeats,
                        Pageable pageable);

        /**
         * Find trips by route and date range
         */
        @Query("""
                        SELECT t FROM Trip t
                        JOIN FETCH t.route r
                        JOIN FETCH t.departureStation
                        JOIN FETCH t.destinationStation
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
                        AND (
                            (t.departureTime <= :departureTime AND t.arrivalTime > :departureTime)
                            OR (t.departureTime < :arrivalTime AND t.arrivalTime >= :arrivalTime)
                            OR (t.departureTime >= :departureTime AND t.arrivalTime <= :arrivalTime)
                        )
                        """)
        boolean hasSchedulingConflict(
                        @Param("busId") UUID busId,
                        @Param("departureTime") LocalDateTime departureTime,
                        @Param("arrivalTime") LocalDateTime arrivalTime);

        /**
         * Check for scheduling conflicts, excluding a specific trip (for updates)
         */
        @Query("""
                        SELECT COUNT(t) > 0 FROM Trip t
                        WHERE t.deleted = false
                        AND t.bus.id = :busId
                        AND t.id != :excludeTripId
                        AND t.status IN ('SCHEDULED', 'BOARDING', 'IN_TRANSIT')
                        AND (
                            (t.departureTime <= :departureTime AND t.arrivalTime > :departureTime)
                            OR (t.departureTime < :arrivalTime AND t.arrivalTime >= :arrivalTime)
                            OR (t.departureTime >= :departureTime AND t.arrivalTime <= :arrivalTime)
                        )
                        """)
        boolean hasSchedulingConflictExcluding(
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
                        JOIN FETCH t.departureStation
                        JOIN FETCH t.destinationStation
                        JOIN FETCH t.bus
                        WHERE t.deleted = false
                        AND t.status = 'SCHEDULED'
                        AND t.departureTime >= :now
                        ORDER BY t.departureTime ASC
                        """)
        Page<Trip> findUpcomingTrips(@Param("now") LocalDateTime now, Pageable pageable);
}
