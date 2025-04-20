package configure;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.refreshtoken")
@Getter
@Setter
public class RefreshTokenConfiguration {
    private int expiration;
}
