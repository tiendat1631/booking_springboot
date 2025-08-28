package org.application.booking.controller.guest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.application.booking.controller.ApiResponse;
import org.application.booking.controller.dto.LoginRequest;
import org.application.booking.controller.dto.LoginResponse;
import org.application.booking.controller.dto.RegisterRequest;
import org.application.booking.domain.aggregates.UserModel.User;
import org.application.booking.exception.InvalidTokenException;
import org.application.booking.security.SecurityService;
import org.application.booking.security.SecurityUtil;
import org.application.booking.security.UserPrinciple;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;

import static org.application.booking.security.SecurityUtil.REFRESH_TOKEN;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;
    private final SecurityService securityService;

    private final JwtDecoder jwtDecoder;

    @Value("${app.jwt.refresh.expiration-in-seconds}")
    private long jwtRefreshExpiration;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get user
        UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();
        User user = userPrinciple.getUser();

        // Create accessToken & refreshToken
        String accessToken = securityUtil.createAccessToken(user);
        String refreshToken = securityUtil.createRefreshToken(user.getUsername().getUsername());

        // Set cookie with refresh token
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN, refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(jwtRefreshExpiration)
                .build();


        // Save refresh token to database
        securityService.setRefreshToken(user, refreshToken);

        ApiResponse<LoginResponse> response = ApiResponse.success("Login success",
                LoginResponse.create(accessToken, user));
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> logout(
            @CookieValue(name = REFRESH_TOKEN, required = false) String refreshToken) {

        if (refreshToken != null && !refreshToken.isBlank()) {
            // fail to decode or user not found -> throw log only
            try {
                Jwt jwt = jwtDecoder.decode(refreshToken);

                // Get sub
                String username = jwt.getSubject();

                // Remove refresh token in database
                securityService.removeRefreshToken(username);
            } catch (Exception e) {
                System.out.println("Invalid refresh token during logout: " + e.getMessage());
            }
        }

        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN, "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.success("Logout success", null));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        securityService.register(registerRequest);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký thành công", null));
    }

    @GetMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> getRefreshToken(
            @CookieValue(name = REFRESH_TOKEN, required = false) String refreshToken) {
        // Check null or empty
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new InvalidTokenException();
        }

        // Check token valid or not
        Jwt jwt = jwtDecoder.decode(refreshToken);

        // Get sub
        String username = jwt.getSubject();

        // Check token exist in db
        User user = securityService.findUserByUserNameAndRefreshToken(username, jwt.getTokenValue())
                .orElseThrow(InvalidTokenException::new);

        // Create token
        String accessToken = securityUtil.createAccessToken(user);
        ApiResponse<LoginResponse> response = ApiResponse.success("Success",
                LoginResponse.create(accessToken, user));

        return ResponseEntity.ok(response);
    }

}
