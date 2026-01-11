package com.dkpm.bus_booking_api.domain.security.events;

public record AcountCreatedEvent(
        String email,
        String verificationToken) {
}
