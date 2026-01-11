package com.dkpm.bus_booking_api.features.payment.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.dkpm.bus_booking_api.domain.payment.Payment;
import com.dkpm.bus_booking_api.domain.payment.PaymentMethod;
import com.dkpm.bus_booking_api.domain.payment.PaymentStatus;

public record PaymentResponse(
        UUID paymentId,
        UUID bookingId,
        String bookingCode,
        PaymentMethod method,
        PaymentStatus status,
        BigDecimal amount,
        String transactionId,
        LocalDateTime paidAt,
        String paymentUrl,
        String paymentNote) {

    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getBooking().getId(),
                payment.getBooking().getBookingCode(),
                payment.getMethod(),
                payment.getStatus(),
                payment.getAmount(),
                payment.getTransactionId(),
                payment.getPaidAt(),
                null,
                payment.getPaymentNote());
    }

    public static PaymentResponse withPaymentUrl(Payment payment, String paymentUrl) {
        return new PaymentResponse(
                payment.getId(),
                payment.getBooking().getId(),
                payment.getBooking().getBookingCode(),
                payment.getMethod(),
                payment.getStatus(),
                payment.getAmount(),
                payment.getTransactionId(),
                payment.getPaidAt(),
                paymentUrl,
                payment.getPaymentNote());
    }
}
