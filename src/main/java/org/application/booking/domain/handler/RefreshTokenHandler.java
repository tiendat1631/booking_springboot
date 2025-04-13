package org.application.booking.domain.handler;

import lombok.RequiredArgsConstructor;
import org.application.booking.domain.event.UserLoggedInEvent;
import org.application.booking.repository.SessionRepository;
import org.application.booking.service.RefreshTokenService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.application.booking.domain.entity.Session;

@Component
@RequiredArgsConstructor
public class RefreshTokenHandler {
    private final RefreshTokenService _refreshTokenService;
    private final SessionRepository _sessionRepository;

    @EventListener
    public void handle(UserLoggedInEvent event){
        Session session = _refreshTokenService.generateRefreshToken(event.getUser());
        _sessionRepository.save(session);
    }
}
