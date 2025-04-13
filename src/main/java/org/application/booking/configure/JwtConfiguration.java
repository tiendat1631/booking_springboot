package org.application.booking.configure;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class JwtConfiguration {

    @Value("${jwt.secret-value}")
    private String secretKey;

    @Value("${jwt.expiration-ms}")
    private long Expiration;


}
