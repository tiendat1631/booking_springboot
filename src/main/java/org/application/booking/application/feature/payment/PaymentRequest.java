package org.application.booking.application.feature.payment;

import lombok.Getter;
import org.application.booking.domain.aggregates.Payment;

import java.util.UUID;
@Getter
public class PaymentRequest {
    private UUID userId;
    private UUID bookingId;
    private Payment.PaymentMethod paymentMethod;
}
