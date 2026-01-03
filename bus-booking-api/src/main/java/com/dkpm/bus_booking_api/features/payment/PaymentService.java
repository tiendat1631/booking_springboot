package com.dkpm.bus_booking_api.features.payment;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dkpm.bus_booking_api.domain.booking.Booking;
import com.dkpm.bus_booking_api.domain.booking.BookingRepository;
import com.dkpm.bus_booking_api.domain.booking.BookingStatus;
import com.dkpm.bus_booking_api.domain.exception.ResourceNotFoundException;
import com.dkpm.bus_booking_api.domain.payment.Payment;
import com.dkpm.bus_booking_api.domain.payment.PaymentMethod;
import com.dkpm.bus_booking_api.domain.payment.PaymentRepository;
import com.dkpm.bus_booking_api.domain.payment.PaymentStatus;
import com.dkpm.bus_booking_api.features.booking.IBookingService;
import com.dkpm.bus_booking_api.features.payment.dto.InitiatePaymentRequest;
import com.dkpm.bus_booking_api.features.payment.dto.PaymentResponse;
import com.dkpm.bus_booking_api.infrastructure.email.IEmailService;
import com.dkpm.bus_booking_api.infrastructure.payment.VNPayClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class PaymentService implements IPaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final IBookingService bookingService;
    private final VNPayClient vnPayClient;
    private final IEmailService emailService;

    @Override
    @Transactional
    public PaymentResponse initiatePayment(UUID bookingId, InitiatePaymentRequest request) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Validate booking status
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Booking is not in PENDING status");
        }

        // Check if booking is expired
        if (booking.isExpired()) {
            // Expire the booking and release seats
            bookingService.expireBooking(bookingId);
            throw new IllegalStateException("Booking has expired");
        }

        // Check for existing payment
        Payment payment = paymentRepository.findByBookingId(bookingId).orElse(null);

        if (payment != null && payment.getStatus() == PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Payment already completed");
        }

        // Create new payment if not exists
        if (payment == null) {
            payment = Payment.builder()
                    .booking(booking)
                    .method(request.method())
                    .status(PaymentStatus.PENDING)
                    .amount(booking.getFinalAmount())
                    .build();
        } else {
            // Update payment method if changed
            payment.setMethod(request.method());
            payment.setStatus(PaymentStatus.PENDING);
        }

        // Generate VNPay URL if payment method is VNPAY
        String paymentUrl = null;
        if (request.method() == PaymentMethod.VNPAY) {
            String txnRef = generateVnpayTxnRef();
            payment.setVnpayTxnRef(txnRef);

            String orderInfo = "Thanh toan ve xe - " + booking.getBookingCode();

            paymentUrl = vnPayClient.createPaymentUrl(
                    txnRef,
                    booking.getFinalAmount(),
                    orderInfo,
                    request.ipAddress(),
                    request.returnUrl());

            log.info("Generated VNPay URL for booking {} with txnRef {}",
                    booking.getBookingCode(), txnRef);
        }

        payment = paymentRepository.save(payment);

        return PaymentResponse.withPaymentUrl(payment, paymentUrl);
    }

    @Override
    public PaymentResponse getPaymentStatus(UUID bookingId) {
        Payment payment = paymentRepository.findByBookingIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking: " + bookingId));

        return PaymentResponse.from(payment);
    }

    @Override
    @Transactional
    public boolean processVnpayCallback(String vnpTxnRef, String vnpResponseCode, String vnpTransactionNo) {
        Payment payment = paymentRepository.findByVnpayTxnRef(vnpTxnRef)
                .orElse(null);

        if (payment == null) {
            log.error("Payment not found for VNPay txnRef: {}", vnpTxnRef);
            return false;
        }

        // Already processed
        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            log.info("Payment already completed for txnRef: {}", vnpTxnRef);
            return true;
        }

        // Check response code
        if (vnPayClient.isSuccessResponse(vnpResponseCode)) {
            payment.complete(vnpTransactionNo);
            paymentRepository.save(payment);

            // Confirm booking
            bookingService.confirmBooking(payment.getBooking().getId());

            // Send payment confirmation email
            Booking confirmedBooking = bookingRepository.findByIdWithDetails(payment.getBooking().getId()).orElse(null);
            if (confirmedBooking != null) {
                emailService.sendPaymentConfirmation(confirmedBooking);
            }

            log.info("VNPay payment successful for booking {}", payment.getBooking().getBookingCode());
            return true;
        } else {
            payment.fail("VNPay response code: " + vnpResponseCode);
            paymentRepository.save(payment);

            log.warn("VNPay payment failed for booking {} with code {}",
                    payment.getBooking().getBookingCode(), vnpResponseCode);
            return false;
        }
    }

    @Override
    @Transactional
    public PaymentResponse confirmCashPayment(UUID bookingId, String note) {
        Payment payment = paymentRepository.findByBookingIdWithDetails(bookingId)
                .orElse(null);

        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Create payment if not exists
        if (payment == null) {
            payment = Payment.builder()
                    .booking(booking)
                    .method(PaymentMethod.CASH)
                    .status(PaymentStatus.PENDING)
                    .amount(booking.getFinalAmount())
                    .build();
        }

        // Mark as completed
        payment.setMethod(PaymentMethod.CASH);
        payment.complete("CASH-" + System.currentTimeMillis());
        payment.setPaymentNote(note);

        payment = paymentRepository.save(payment);

        // Confirm booking
        bookingService.confirmBooking(bookingId);

        // Send payment confirmation email
        Booking confirmedBooking = bookingRepository.findByIdWithDetails(bookingId).orElse(null);
        if (confirmedBooking != null) {
            emailService.sendPaymentConfirmation(confirmedBooking);
        }

        log.info("Cash payment confirmed for booking {}", booking.getBookingCode());

        return PaymentResponse.from(payment);
    }


    /**
     * Generate unique VNPay transaction reference
     */
    private String generateVnpayTxnRef() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String randomPart = String.format("%04d", ThreadLocalRandom.current().nextInt(10000));
        return datePart + randomPart;
    }
}
