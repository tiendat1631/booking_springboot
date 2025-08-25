package org.application.booking.security;

import lombok.RequiredArgsConstructor;
import org.application.booking.controller.dto.RegisterRequest;
import org.application.booking.domain.aggregates.UserModel.Email;
import org.application.booking.domain.aggregates.UserModel.User;
import org.application.booking.domain.aggregates.UserModel.Username;
import org.application.booking.exception.EmailAlreadyExistException;
import org.application.booking.exception.UsernameAlreadyExistException;
import org.application.booking.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SecurityService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void register(RegisterRequest registerRequest) {
        Username username = Username.CreateUsername(registerRequest.username());
        Email email = Email.createEmail(registerRequest.email());

        if (userRepository.existsByUsername(username)) {
            throw new UsernameAlreadyExistException();
        }
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistException();
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setName(registerRequest.username());
        newUser.setAge(registerRequest.age());
        newUser.setPassword(passwordEncoder.encode(registerRequest.password()));

        // save the new user to the db
        userRepository.save(newUser);
    }

    public void setRefreshToken(User user, String token) {
        user.setRefreshToken(token);
        userRepository.save(user);
    }

    public Optional<User> findUserByUserNameAndRefreshToken(String username, String token) {
        return userRepository.findByUsernameAndRefreshToken(Username.CreateUsername(username), token);
    }
}
