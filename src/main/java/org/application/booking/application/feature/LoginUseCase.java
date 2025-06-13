package org.application.booking.application.feature;

import org.application.booking.application.service.JwtService;
import org.application.booking.application.service.RefreshTokenService;
import org.application.booking.domain.ValueObject.Username;
import org.application.booking.domain.entity.Session;
import org.application.booking.domain.entity.User;
import org.application.booking.repository.SessionRepository;
import org.application.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.application.booking.presentation.DTO.LoginRequest;
import org.application.booking.presentation.DTO.LoginResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class LoginUseCase {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final SessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest loginRequest) {
        Username username = new Username(loginRequest.getUsername());
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = optionalUser.get();

        // check password by Bcrypt
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String jwtToken = jwtService.generateToken(user);
        Session jwtRefreshToken = refreshTokenService.generateRefreshToken(user);
        sessionRepository.save(jwtRefreshToken);

        return new LoginResponse(jwtToken,jwtRefreshToken.getToken());
    }

}
