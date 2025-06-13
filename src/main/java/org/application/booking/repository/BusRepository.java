package org.application.booking.repository;

import org.application.booking.domain.entity.BusBoundary.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BusRepository extends JpaRepository<Bus, UUID> {
}
