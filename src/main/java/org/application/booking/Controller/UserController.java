package org.application.booking.Controller;

import org.application.booking.DTO.LoginRequest;
import org.application.booking.DTO.LoginResponse;
import org.application.booking.Entity.User;
import org.application.booking.Repository.UserRepository;
import org.application.booking.application.usecase.LoginUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;

    private final LoginUseCase loginUseCase;

    public UserController(UserRepository userRepository, LoginUseCase loginUseCase) {
        this.userRepository = userRepository;
        this.loginUseCase = loginUseCase;
    }

    // Get all users
    @GetMapping
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    // Create a new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        String token = loginUseCase.login(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(new LoginResponse(token));
    }
}
