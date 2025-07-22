package org.application.booking.presentation.controller;

import org.application.booking.domain.aggregates.UserModel.User;
import org.application.booking.repository.UserRepository;
import org.springframework.context.annotation.Role;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all users
    @GetMapping
    public List<User> getUsers() {
        return userRepository.findAll();
    }

}
