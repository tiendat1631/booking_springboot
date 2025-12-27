package com.dkpm.bus_booking_api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(
        Long expiration,
        Long refreshExpiration) {
}
