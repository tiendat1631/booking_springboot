package com.dkpm.bus_booking_api.domain.booking;

import java.time.LocalDateTime;

import com.dkpm.bus_booking_api.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Token for booking cancellation OTP verification
 */
@Entity
@Table(name = "cancellation_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CancellationToken extends BaseEntity {

    @Column(nullable = false, length = 6)
    private String otpCode;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    @Column(nullable = false)
    @Builder.Default
    private int attempts = 0;

    private static final int MAX_ATTEMPTS = 3;
    private static final int OTP_EXPIRY_MINUTES = 10;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryTime);
    }

    public boolean hasExceededMaxAttempts() {
        return this.attempts >= MAX_ATTEMPTS;
    }

    public void incrementAttempts() {
        this.attempts++;
    }

    public static CancellationToken create(Booking booking, String otpCode) {
        return CancellationToken.builder()
                .booking(booking)
                .otpCode(otpCode)
                .expiryTime(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .attempts(0)
                .build();
    }
}
