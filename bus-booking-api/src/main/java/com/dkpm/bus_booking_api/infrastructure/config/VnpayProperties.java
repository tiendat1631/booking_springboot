package com.dkpm.bus_booking_api.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "vnpay")
public record VnpayProperties(
                String tmnCode,
                String hashSecret,
                String url,
                String returnUrl,
                String version) {
}
