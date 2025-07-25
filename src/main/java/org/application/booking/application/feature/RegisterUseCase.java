    package org.application.booking.application.feature;

    import org.application.booking.application.service.JwtService;
    import org.application.booking.application.service.RefreshTokenService;
    import org.application.booking.domain.aggregates.UserModel.Email;
    import org.application.booking.domain.aggregates.UserModel.Username;
    import org.application.booking.domain.aggregates.UserModel.Session;
    import org.application.booking.domain.aggregates.UserModel.User;
    import org.application.booking.repository.SessionRepository;
    import lombok.RequiredArgsConstructor;
    import org.application.booking.presentation.DTO.RegisterRequest;
    import org.application.booking.repository.UserRepository;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;
    import org.application.booking.presentation.DTO.RegisterResponse;


    @RequiredArgsConstructor
    @Service
    public class RegisterUseCase {
        private final JwtService jwtService;
        private final RefreshTokenService refreshTokenService;
        private final SessionRepository sessionRepository;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        public RegisterResponse register (RegisterRequest registerRequest) {
            Username username = Username.CreateUsername(registerRequest.getUsername());
            Email email = Email.createEmail(registerRequest.getEmail());

            if (userRepository.existsByUsername(username)) {
                throw new RuntimeException("Username is already in use");
            }
            if (userRepository.existsByEmail(email)) {
                throw new RuntimeException("Email is already in use");
            }

            User newUser = new User();
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setName(registerRequest.getUsername());
            newUser.setAge(registerRequest.getAge());
            newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            //newUser.setPhoneNum(registerRequest.getPhoneNum());

            // save the new user to the db
            userRepository.save(newUser);

            // tu dong dang nhap sau khi dang ki
            String jwtToken = jwtService.generateToken(newUser);
            Session jwtRefreshToken = refreshTokenService.generateRefreshToken(newUser);
            sessionRepository.save(jwtRefreshToken);

            RegisterResponse response = new RegisterResponse();
            response.setMessage("User registered successfully");
            response.setUserId(newUser.getId());
            response.setToken(jwtToken);
            response.setRefreshToken(jwtRefreshToken.getToken());
            return response;
        }
    }
