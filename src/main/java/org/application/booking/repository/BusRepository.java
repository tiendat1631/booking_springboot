package org.application.booking.repository;

import org.application.booking.domain.aggregates.BusModel.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BusRepository extends JpaRepository<Bus, UUID> {
    boolean existsByLicensePlate(String licensePlate);
}
