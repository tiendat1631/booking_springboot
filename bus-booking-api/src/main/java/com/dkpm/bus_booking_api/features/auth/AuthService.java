package com.dkpm.bus_booking_api.features.auth;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dkpm.bus_booking_api.domain.security.Account;
import com.dkpm.bus_booking_api.domain.security.AccountRepository;
import com.dkpm.bus_booking_api.domain.security.Role;
import com.dkpm.bus_booking_api.domain.security.VerificationToken;
import com.dkpm.bus_booking_api.domain.security.VerificationTokenRepository;
import com.dkpm.bus_booking_api.domain.user.Profile;
import com.dkpm.bus_booking_api.features.auth.dto.RegisterRequest;
import com.dkpm.bus_booking_api.infrastructure.email.IEmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService implements IAuthService {

    private final AccountRepository accountRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final IEmailService emailService;

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

        // Send Email
        emailService.sendVerificationEmail(account, token);

        log.info("User registered: {}. Verification token sent.", request.email());
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
}
