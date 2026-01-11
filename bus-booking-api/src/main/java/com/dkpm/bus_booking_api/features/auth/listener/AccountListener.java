package com.dkpm.bus_booking_api.features.auth.listener;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.dkpm.bus_booking_api.domain.security.events.AcountCreatedEvent;
import com.dkpm.bus_booking_api.infrastructure.email.IEmailService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AccountListener {

    private final IEmailService mailService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async("mailExecutor")
    public void handleSendConfirmCode(AcountCreatedEvent event) {
        mailService.sendVerificationEmail(event.email(), event.verificationToken());
    }
}
