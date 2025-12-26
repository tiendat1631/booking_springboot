package com.dkpm.bus_booking_api.infrastructure.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.dkpm.bus_booking_api.config.JwtProperties;

import lombok.RequiredArgsConstructor;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final JwtEncoder encoder;
    private final JwtProperties jwtProperties;

    public String generateToken(Authentication authentication) {
        Instant now = Instant.now();

        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> auth.startsWith("ROLE_"))
                .collect(Collectors.joining(" "));

        // Get user ID from AccountPrincipal
        AccountPrincipal principal = (AccountPrincipal) authentication.getPrincipal();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(jwtProperties.expiration(), ChronoUnit.MILLIS))
                .subject(authentication.getName())
                .claim("userId", principal.getId().toString())
                .claim("roles", roles)
                .build();

        return this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}
