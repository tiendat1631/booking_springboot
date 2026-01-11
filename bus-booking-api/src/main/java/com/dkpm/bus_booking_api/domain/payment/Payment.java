package com.dkpm.bus_booking_api.domain.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.dkpm.bus_booking_api.domain.booking.Booking;
import com.dkpm.bus_booking_api.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking; // 1 booking = 1 payment

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod method; // VNPAY, CASH

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;  // PENDING, COMPLETED, FAILED

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;  // ID từ gateway

    @Column(name = "vnpay_txn_ref", length = 100)
    private String vnpayTxnRef; // Unique ref cho VNPay

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "payment_note", columnDefinition = "TEXT")
    private String paymentNote;

    /**
     * Mark payment as completed
     */
    public void complete(String transactionId) {
        this.status = PaymentStatus.COMPLETED;
        this.transactionId = transactionId;
        this.paidAt = LocalDateTime.now();
    }

    /**
     * Mark payment as failed
     */
    public void fail(String reason) {
        this.status = PaymentStatus.FAILED;
        this.paymentNote = reason;
    }

    /**
     * Mark payment as refunded
     */
    public void refund(String reason) {
        this.status = PaymentStatus.REFUNDED;
        this.paymentNote = reason;
    }
}
