package application.feature;

import application.service.JwtService;
import application.service.RefreshTokenService;
import domain.entity.Session;
import domain.entity.User;
import infrastructure.repository.SessionRepository;
import infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import presentation.DTO.LoginResponse;
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

    public LoginResponse login(String username, String password) {
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = optionalUser.get();

        // check password by Bcrypt
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String jwtToken = jwtService.generateToken(user);
        Session jwtRefreshToken = refreshTokenService.generateRefreshToken(user);
        sessionRepository.save(jwtRefreshToken);

        return new LoginResponse(jwtToken,jwtRefreshToken.getToken());
    }

}
