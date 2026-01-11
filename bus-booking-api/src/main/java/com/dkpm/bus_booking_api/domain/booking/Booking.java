package com.dkpm.bus_booking_api.domain.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.dkpm.bus_booking_api.domain.common.BaseEntity;
import com.dkpm.bus_booking_api.domain.payment.Payment;
import com.dkpm.bus_booking_api.domain.security.models.Account;
import com.dkpm.bus_booking_api.domain.trip.Trip;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking extends BaseEntity {

    @Column(name = "booking_code", unique = true, nullable = false, length = 20)
    private String bookingCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Account customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name = "passenger_name", nullable = false)
    private String passengerName;

    @Column(name = "passenger_phone", nullable = false, length = 20)
    private String passengerPhone;

    @Column(name = "passenger_email")
    private String passengerEmail;

    @Column(name = "total_amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "discount_amount", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "final_amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal finalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "booking_time", nullable = false)
    private LocalDateTime bookingTime;

    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BookingDetail> details = new ArrayList<>();

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Payment payment;

    @Version
    private Long version;

    /**
     * Calculate final amount after discount
     */
    public void calculateFinalAmount() {
        this.finalAmount = this.totalAmount.subtract(
                this.discountAmount != null ? this.discountAmount : BigDecimal.ZERO);
    }

    /**
     * Add a booking detail
     */
    public void addDetail(BookingDetail detail) {
        details.add(detail);
        detail.setBooking(this);
    }

    /**
     * Check if booking is expired
     * - Cash payments: expire at trip departure time
     * - Other payments: expire after 15 minutes (expiryTime)
     */
    public boolean isExpired() {
        if (this.status != BookingStatus.PENDING) {
            return false;
        }

        // For cash payments, expire at trip departure time
        if (this.payment != null
                && this.payment.getMethod() == com.dkpm.bus_booking_api.domain.payment.PaymentMethod.CASH) {
            return LocalDateTime.now().isAfter(this.trip.getDepartureTime());
        }

        // For other payment methods, use the standard expiry time (15 minutes)
        return LocalDateTime.now().isAfter(this.expiryTime);
    }

    /**
     * Check if booking can be cancelled
     */
    public boolean canBeCancelled() {
        return this.status == BookingStatus.PENDING || this.status == BookingStatus.CONFIRMED;
    }

    /**
     * Get seat count
     */
    public int getSeatCount() {
        return details.size();
    }
}
