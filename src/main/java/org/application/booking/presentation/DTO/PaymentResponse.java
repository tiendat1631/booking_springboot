package org.application.booking.presentation.DTO;

import lombok.*;
import org.application.booking.domain.aggregates.Payment;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    private UUID paymentId;
    private UUID bookingId;
    private UUID userId;
    private float amount;
    private Payment.PaymentMethod paymentMethod;
    private Payment.PaymentStatus paymentStatus;
    private LocalDateTime paymentDate;
}
