package com.dkpm.bus_booking_api.features.payment;

import java.util.UUID;

import com.dkpm.bus_booking_api.features.payment.dto.InitiatePaymentRequest;
import com.dkpm.bus_booking_api.features.payment.dto.PaymentResponse;

public interface IPaymentService {

    /**
     * Initiate payment for a booking
     */
    PaymentResponse initiatePayment(UUID bookingId, InitiatePaymentRequest request);

    /**
     * Get payment status
     */
    PaymentResponse getPaymentStatus(UUID bookingId);

    /**
     * Process VNPay callback
     */
    boolean processVnpayCallback(String vnpTxnRef, String vnpResponseCode, String vnpTransactionNo);

    /**
     * Mark payment as completed by cash (Admin)
     */
    PaymentResponse confirmCashPayment(UUID bookingId, String note);
}
