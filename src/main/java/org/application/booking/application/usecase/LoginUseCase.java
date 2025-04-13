package org.application.booking.application.usecase;

import org.application.booking.Entity.User;
import org.application.booking.Repository.UserRepository;
import org.application.booking.service.JwtService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginUseCase {
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public LoginUseCase(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public String login(String username, String password) {
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }
        return jwtService.generateToken(user);
    }


}
