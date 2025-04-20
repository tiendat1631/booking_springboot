    package application.feature;

    import domain.ValueObject.Username;
    import domain.entity.User;
    import lombok.RequiredArgsConstructor;
    import presentation.DTO.RegisterRequest;
    import infrastructure.repository.UserRepository;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;

    @RequiredArgsConstructor
    @Service
    public class RegisterUseCase {
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        public void register (RegisterRequest registerRequest) {
            if (userRepository.existsByUsername(registerRequest.getUsername())) {
                System.out.println("Username is already in use");
            }
            else {
                User newUser = new User();
                Username username = Username.CreateUsername(registerRequest.getUsername());
                newUser.setUsername(username);
                newUser.setEmail(registerRequest.getEmail());
                newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
                userRepository.save(newUser);
            }

        }
    }
