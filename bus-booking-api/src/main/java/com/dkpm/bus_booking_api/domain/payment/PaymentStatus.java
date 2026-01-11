package com.dkpm.bus_booking_api.domain.payment;

public enum PaymentStatus {
    PENDING, // Payment initiated but not completed
    COMPLETED, // Payment successful
    FAILED, // Payment failed
    REFUNDED // Payment was refunded
}
