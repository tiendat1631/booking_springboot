package org.application.booking.presentation.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.application.booking.application.feature.payment.CreatePaymentUseCase;
import org.application.booking.application.feature.payment.PaymentRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/payment")
public class PaymentController {
    private final CreatePaymentUseCase createPaymentUseCase;

    @PostMapping
    public void makePay (@RequestBody PaymentRequest paymentRequest) {
        this.createPaymentUseCase.makePayment(paymentRequest);
    }
}
