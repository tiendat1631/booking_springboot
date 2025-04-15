package org.application.booking.application.usecase;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.application.booking.DTO.LoginResponse;
import org.application.booking.configure.RefreshTokenConfiguration;
import org.application.booking.domain.entity.Session;
import org.application.booking.domain.entity.User;
import org.application.booking.repository.SessionRepository;
import org.application.booking.repository.UserRepository;
import org.application.booking.service.JwtService;
import org.application.booking.service.RefreshTokenService;
import org.springframework.stereotype.Service;

import java.util.Optional;
@RequiredArgsConstructor
@Service
public class LoginUseCase {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final SessionRepository sessionRepository;

    public LoginResponse login(String username, String password) {
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }
        String jwtToken = jwtService.generateToken(user);
        Session jwtRefreshToken = refreshTokenService.generateRefreshToken(user);

        sessionRepository.save(jwtRefreshToken);

        return new LoginResponse(jwtToken,jwtRefreshToken.getToken());
    }



}
