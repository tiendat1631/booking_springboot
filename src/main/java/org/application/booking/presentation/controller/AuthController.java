package org.application.booking.presentation.controller;

import jakarta.validation.Valid;
import org.application.booking.application.feature.LoginUseCase;
import org.application.booking.application.feature.RegisterUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.application.booking.presentation.DTO.LoginRequest;
import org.application.booking.presentation.DTO.LoginResponse;
import org.application.booking.presentation.DTO.RegisterRequest;
import org.application.booking.presentation.DTO.RegisterResponse;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final LoginUseCase loginUseCase;
    private final RegisterUseCase registerUseCase;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = loginUseCase.login(loginRequest);
        return ResponseEntity.ok(loginResponse);
    }
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        RegisterResponse registerResponse = registerUseCase.register(registerRequest);
        return ResponseEntity.ok(registerResponse);
    }

}
