package org.application.booking.controller.controller;

import lombok.AllArgsConstructor;
import org.application.booking.controller.dto.PaymentRequest;
import org.application.booking.service.payment.CreatePaymentUseCase;
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
    public void makePay(@RequestBody PaymentRequest paymentRequest) {
        this.createPaymentUseCase.makePayment(paymentRequest);
    }
}
