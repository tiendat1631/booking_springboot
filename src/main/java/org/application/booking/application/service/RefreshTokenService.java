package org.application.booking.application.service;

import org.application.booking.configure.RefreshTokenConfiguration;
import org.application.booking.domain.entity.Session;
import org.application.booking.domain.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.temporal.ChronoUnit;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenConfiguration _rTConfig;

    public Session generateRefreshToken(User user) {
        String refreshToken = UUID.randomUUID().toString();
        Instant now = Instant.now();
        Instant expiry = now.plus(_rTConfig.getExpiration(), ChronoUnit.DAYS);

        return Session.builder()
                .user(user)
                .token(refreshToken)
                .createdAt(now)
                .expiresAt(expiry)
                .revoked(false)
                .build();
    }
}
