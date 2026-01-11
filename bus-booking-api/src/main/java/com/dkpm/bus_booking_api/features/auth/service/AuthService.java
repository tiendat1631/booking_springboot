package com.dkpm.bus_booking_api.features.auth.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dkpm.bus_booking_api.infrastructure.config.JwtProperties;
import com.dkpm.bus_booking_api.features.auth.dto.LoginRequest;
import com.dkpm.bus_booking_api.features.auth.dto.RegisterRequest;
import com.dkpm.bus_booking_api.features.auth.dto.TokenResponse;
import com.dkpm.bus_booking_api.domain.security.events.AcountCreatedEvent;
import com.dkpm.bus_booking_api.domain.security.models.Account;
import com.dkpm.bus_booking_api.domain.security.models.RefreshToken;
import com.dkpm.bus_booking_api.domain.security.models.Role;
import com.dkpm.bus_booking_api.domain.security.models.VerificationToken;
import com.dkpm.bus_booking_api.domain.security.repositories.AccountRepository;
import com.dkpm.bus_booking_api.domain.security.repositories.VerificationTokenRepository;
import com.dkpm.bus_booking_api.domain.user.Profile;
import com.dkpm.bus_booking_api.infrastructure.security.RefreshTokenService;
import com.dkpm.bus_booking_api.infrastructure.security.TokenService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService implements IAuthService {

    private final AccountRepository accountRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final RefreshTokenService refreshTokenService;
    private final JwtProperties jwtProperties;

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (accountRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create Account
        Account account = Account.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.CUSTOMER)
                .enabled(false) // Disabled until email verified
                .emailVerified(false)
                .build();

        // Create Profile
        Profile profile = new Profile();
        profile.setAccount(account);
        profile.setFirstName(request.firstName());
        profile.setLastName(request.lastName());
        profile.setPhoneNumber(request.phone());
        account.setProfile(profile);

        accountRepository.save(account);

        // Generate Verification Token
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .account(account)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .build();

        verificationTokenRepository.save(verificationToken);

        eventPublisher.publishEvent(new AcountCreatedEvent(
                account.getEmail(),
                token));

        log.info("New user registered: {}", account.getEmail());
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification token"));

        if (verificationToken.isExpired()) {
            throw new IllegalStateException("Verification token has expired");
        }

        Account account = verificationToken.getAccount();
        account.setEnabled(true);
        account.setEmailVerified(true);
        accountRepository.save(account);

        // Delete token after successful verification
        verificationTokenRepository.delete(verificationToken);

        log.info("Email verified for user: {}", account.getEmail());
    }

    @Override
    @Transactional
    public TokenResponse login(LoginRequest request) {
        Authentication authenticationRequest = UsernamePasswordAuthenticationToken
                .unauthenticated(request.email(), request.password());
        // Authenticate to verify credentials
        authenticationManager.authenticate(authenticationRequest);

        // Get account and generate tokens
        Account account = accountRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // Generate access token
        String accessToken = tokenService.generateToken(account);
        
        // Generate refresh token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(account);

        log.info("User logged in: {}", request.email());

        return new TokenResponse(
                accessToken,
                refreshToken.getToken(),
                jwtProperties.expiration());
    }

    @Override
    @Transactional
    public TokenResponse refreshToken(String refreshTokenValue) {
        // Verify refresh token
        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(refreshTokenValue);
        Account account = refreshToken.getAccount();

        // Generate new access token
        String accessToken = tokenService.generateToken(account);

        // Generate new refresh token (token rotation)
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(account);

        log.info("Token refreshed for user: {}", account.getEmail());

        return new TokenResponse(
                accessToken,
                newRefreshToken.getToken(),
                jwtProperties.expiration());
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        refreshTokenService.revokeRefreshToken(refreshToken);
        log.info("User logged out");
    }
}
