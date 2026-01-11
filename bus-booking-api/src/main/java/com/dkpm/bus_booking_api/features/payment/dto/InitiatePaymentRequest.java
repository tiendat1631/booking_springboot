package com.dkpm.bus_booking_api.features.payment.dto;

import com.dkpm.bus_booking_api.domain.payment.PaymentMethod;

import jakarta.validation.constraints.NotNull;

public record InitiatePaymentRequest(
                @NotNull(message = "Payment method is required") PaymentMethod method,

                String returnUrl) {
}
