package org.application.booking.presentation.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.application.booking.presentation.ApiResponse;
import org.application.booking.security.CustomUserDetailsService;
import org.application.booking.security.JwtUtil;
import org.application.booking.security.SecurityService;
import org.application.booking.security.UserPrinciple;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.application.booking.presentation.DTO.LoginRequest;
import org.application.booking.presentation.DTO.LoginResponse;
import org.application.booking.presentation.DTO.RegisterRequest;
import org.application.booking.presentation.DTO.RegisterResponse;

import java.util.UUID;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    private final SecurityService securityService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password()));

            UserPrinciple userPrinciple = (UserPrinciple) userDetailsService.loadUserByUsername(request.username());
            String token = jwtUtil.generateToken(userPrinciple);
            UUID userId = userPrinciple.getUser().getId();

            ApiResponse<LoginResponse> response = ApiResponse.success("Login success",new LoginResponse(token, userId));
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            ApiResponse<LoginResponse> response = ApiResponse.failure("Tên đăng nhập hoặc mật khẩu không đúng");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        securityService.register(registerRequest);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký thành công", null));
    }

}
