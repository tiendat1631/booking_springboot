package org.application.booking.presentation.guest.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.application.booking.domain.aggregates.UserModel.User;
import org.application.booking.presentation.ApiResponse;
import org.application.booking.presentation.guest.dto.LoginRequest;
import org.application.booking.presentation.guest.dto.LoginResponse;
import org.application.booking.presentation.guest.dto.RegisterRequest;
import org.application.booking.security.SecurityService;
import org.application.booking.security.SecurityUtil;
import org.application.booking.security.UserPrinciple;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;
    private final SecurityService securityService;

    @Value("${app.jwt.refresh.expiration-in-seconds}")
    private long jwtRefreshExpiration;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        StringBuilder sb = new StringBuilder("Authorities: ");
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            sb.append(authority.getAuthority()).append(" ");
        }

        System.out.println(sb.toString().trim());

        // Create accessToken & refreshToken
        String accessToken = securityUtil.createAccessToken(authentication);

        String refreshToken = securityUtil.createRefreshToken(authentication);

        // Set cookie with refresh token
        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(jwtRefreshExpiration)
                .build();

        // Get user
        UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();
        User user = userPrinciple.getUser();

        ApiResponse<LoginResponse> response = ApiResponse.success("Login success",
                LoginResponse.create(accessToken, user));
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        securityService.register(registerRequest);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký thành công", null));
    }

}
