package org.application.booking.Controller;

import org.application.booking.Entity.User;
import org.application.booking.Repository.UserRepository;
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

    // Create a new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
}
