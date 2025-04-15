package org.application.booking.controller;

import org.application.booking.DTO.LoginRequest;
import org.application.booking.DTO.LoginResponse;
import org.application.booking.domain.entity.User;
import org.application.booking.repository.UserRepository;
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
        LoginResponse result = loginUseCase.login(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(result);
    }
    @PostMapping("/adduser")
    public void addUser(@RequestBody User user) {
        userRepository.save(user);
    }
    @GetMapping("/finduser")
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username).get();
    }
}
