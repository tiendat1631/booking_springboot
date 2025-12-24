package com.dkpm.bus_booking_api.infrastructure.email;

import com.dkpm.bus_booking_api.domain.booking.Booking;

/**
 * Email service interface for sending various email notifications
 */
public interface IEmailService {

    /**
     * Send booking confirmation email
     */
    void sendBookingConfirmation(Booking booking);

    /**
     * Send booking cancellation email
     */
    void sendBookingCancellation(Booking booking);

    /**
     * Send payment confirmation email
     */
    void sendPaymentConfirmation(Booking booking);

    /**
     * Send email verification token
     */
    void sendVerificationEmail(com.dkpm.bus_booking_api.domain.security.Account account, String token);

    /**
     * Send generic email
     */
    void sendEmail(String to, String subject, String htmlContent);
}
