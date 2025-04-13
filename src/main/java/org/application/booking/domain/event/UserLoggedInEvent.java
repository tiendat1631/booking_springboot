package org.application.booking.domain.event;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;
import org.application.booking.domain.entity.User;

@Setter
@Getter
public class UserLoggedInEvent extends ApplicationEvent {
    private final User user;

    public UserLoggedInEvent(Object source, User user) {
        super(source);
        this.user = user;
    }
}
