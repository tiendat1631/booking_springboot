package org.application.booking.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class JwtConfig {

    @Value("${jwt.secret-key}") // phai khop voi file properties
    private String secretKey;

    @Value("${jwt.expiration-ms}") //phai khop voi file properties
    private long expiration;


}
