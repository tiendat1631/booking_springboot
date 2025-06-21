package org.application.booking.domain.aggregates;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.application.booking.domain.aggregates.BookingModel.Booking;
import org.application.booking.domain.aggregates.UserModel.User;
import org.application.booking.domain.common.BaseEntity;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Payment extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    @CreationTimestamp
    private LocalDateTime paymentDate;


    public enum PaymentMethod {
        CREDIT_CARD,
        DEBIT_CARD,
        CASH,
        DIGITAL_WALLET,
        BANK_TRANSFER,
    }
    public enum PaymentStatus {
        PENDING,
        APPROVED,
        REJECTED,
        REFUNDED,
    }
}
