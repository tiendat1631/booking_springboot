package com.dkpm.bus_booking_api.features.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dkpm.bus_booking_api.features.auth.dto.LoginRequest;
import com.dkpm.bus_booking_api.infrastructure.security.TokenService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        Authentication authenticationRequest = UsernamePasswordAuthenticationToken
                .unauthenticated(loginRequest.username(), loginRequest.password());
        Authentication authenticationResponse = this.authenticationManager.authenticate(authenticationRequest);

        String token = tokenService.generateToken(authenticationResponse);
        return ResponseEntity.ok(token);
    }
}
