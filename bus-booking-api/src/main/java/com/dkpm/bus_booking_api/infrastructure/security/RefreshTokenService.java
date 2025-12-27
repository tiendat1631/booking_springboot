package com.dkpm.bus_booking_api.infrastructure.security;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dkpm.bus_booking_api.config.JwtProperties;
import com.dkpm.bus_booking_api.domain.security.Account;
import com.dkpm.bus_booking_api.domain.security.RefreshToken;
import com.dkpm.bus_booking_api.domain.security.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;

    @Transactional
    public RefreshToken createRefreshToken(Account account) {
        // Revoke all existing refresh tokens for this account
        refreshTokenRepository.revokeAllByAccountId(account.getId());

        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .account(account)
                .expiryDate(LocalDateTime.now().plusSeconds(jwtProperties.refreshExpiration() / 1000))
                .revoked(false)
                .build();

        refreshToken = refreshTokenRepository.save(refreshToken);
        log.debug("Created refresh token for account: {}", account.getEmail());
        return refreshToken;
    }

    @Transactional(readOnly = true)
    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (!refreshToken.isValid()) {
            throw new IllegalStateException("Refresh token is expired or revoked");
        }

        return refreshToken;
    }

    @Transactional
    public void revokeRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
        log.debug("Revoked refresh token: {}", token);
    }

    @Transactional
    public void revokeAllTokensForAccount(UUID accountId) {
        refreshTokenRepository.revokeAllByAccountId(accountId);
        log.debug("Revoked all refresh tokens for account: {}", accountId);
    }

    @Transactional
    public void cleanupExpiredTokens() {
        refreshTokenRepository.deleteExpiredTokens();
        log.info("Cleaned up expired refresh tokens");
    }
}
