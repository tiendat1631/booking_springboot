package org.application.booking.configure;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.jwttoken")

@Getter
@Setter
public class JwtConfiguration {
    private int expiration;
    private String secretkey;
}
