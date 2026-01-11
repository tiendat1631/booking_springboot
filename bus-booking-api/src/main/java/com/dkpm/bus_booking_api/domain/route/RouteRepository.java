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
                        WHERE r.deleted = false
                        AND (:isActive IS NULL OR r.active = :isActive)
                        AND (:name IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :name, '%')))
                        AND (:code IS NULL OR LOWER(r.code) LIKE LOWER(CONCAT('%', :code, '%')))
                        AND (:departureProvince IS NULL OR LOWER(r.departureProvince.codename) = LOWER(:departureProvince))
                        AND (:destinationProvince IS NULL OR LOWER(r.destinationProvince.codename) = LOWER(:destinationProvince))
                        """)
        Page<Route> searchRoutes(
                        @Param("name") String name,
                        @Param("code") String code,
                        @Param("departureProvince") String departureProvince,
                        @Param("destinationProvince") String destinationProvince,
                        @Param("isActive") Boolean isActive,
                        Pageable pageable);

        @Query("SELECT r FROM Route r WHERE r.active = true AND r.deleted = false ORDER BY r.name")
        List<Route> findAllActive();

        @Query("""
                        SELECT r FROM Route r
                        WHERE r.deleted = false
                        AND r.active = true
                        AND r.departureProvince.codename = :departureProvinceCodename
                        AND r.destinationProvince.codename = :destinationProvinceCodename
                        """)
        Optional<Route> findByProvinces(
                        @Param("departureProvinceCodename") String departureProvinceCodename,
                        @Param("destinationProvinceCodename") String destinationProvinceCodename);
}
