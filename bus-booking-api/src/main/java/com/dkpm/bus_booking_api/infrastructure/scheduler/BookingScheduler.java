package com.dkpm.bus_booking_api.infrastructure.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.dkpm.bus_booking_api.features.booking.IBookingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Scheduled tasks for booking management
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BookingScheduler {

    private final IBookingService bookingService;

    /**
     * Cleanup expired bookings every 5 minutes
     * This ensures that expired bookings are automatically updated to EXPIRED
     * status
     * and their reserved seats are released back to the pool
     */
    @Scheduled(fixedDelay = 300000) // 5 minutes = 300,000 milliseconds
    public void cleanupExpiredBookings() {
        try {
            log.info("Starting scheduled cleanup of expired bookings");
            bookingService.processExpiredBookings();
            log.info("Completed scheduled cleanup of expired bookings");
        } catch (Exception e) {
            log.error("Failed to cleanup expired bookings: {}", e.getMessage(), e);
        }
    }
}
