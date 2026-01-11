package com.dkpm.bus_booking_api.infrastructure.security;

import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.dkpm.bus_booking_api.infrastructure.config.JwtProperties;
import com.dkpm.bus_booking_api.domain.security.models.Account;

import lombok.RequiredArgsConstructor;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final JwtEncoder encoder;
    private final JwtProperties jwtProperties;

    public String generateToken(Account account) {
        Instant now = Instant.now();

        String roles = account.getRole().name();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(jwtProperties.expiration(), ChronoUnit.MILLIS))
                .subject(account.getEmail())
                .claim("userId", account.getId().toString())
                .claim("roles", roles)
                .build();

        return this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}
