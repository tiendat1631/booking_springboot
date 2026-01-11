// package com.dkpm.bus_booking_api.features.auth;

// import static org.assertj.core.api.Assertions.assertThat;
// import static org.assertj.core.api.Assertions.assertThatThrownBy;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.never;
// import static org.mockito.Mockito.verify;
// import static org.mockito.Mockito.when;

// import java.time.LocalDateTime;
// import java.util.Optional;
// import java.util.UUID;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.ArgumentCaptor;
// import org.mockito.Captor;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;
// import org.springframework.security.crypto.password.PasswordEncoder;

// import com.dkpm.bus_booking_api.domain.security.models.Account;
// import com.dkpm.bus_booking_api.domain.security.models.Role;
// import com.dkpm.bus_booking_api.domain.security.models.VerificationToken;
// import com.dkpm.bus_booking_api.domain.security.repositories.AccountRepository;
// import com.dkpm.bus_booking_api.domain.security.repositories.VerificationTokenRepository;

// import com.dkpm.bus_booking_api.features.auth.service.AuthService;
// import com.dkpm.bus_booking_api.infrastructure.email.IEmailService;

// @ExtendWith(MockitoExtension.class)
// @DisplayName("AuthService Unit Tests")
// class AuthServiceTest {

//     @Mock
//     private AccountRepository accountRepository;

//     @Mock
//     private VerificationTokenRepository verificationTokenRepository;

//     @Mock
//     private PasswordEncoder passwordEncoder;

//     @Mock
//     private IEmailService emailService;

//     @InjectMocks
//     private AuthService authService;

//     @Captor
//     private ArgumentCaptor<Account> accountCaptor;

//     @Captor
//     private ArgumentCaptor<VerificationToken> tokenCaptor;

//     private RegisterRequest validRegisterRequest;

//     @BeforeEach
//     void setUp() {
//         validRegisterRequest = new RegisterRequest(
//                 "test@example.com",
//                 "password123",
//                 "John",
//                 "Doe",
//                 "0901234567");
//     }

//     // ==================== REGISTER TESTS ====================

//     @Test
//     @DisplayName("register - success creates account and sends verification email")
//     void register_success_createsAccountAndSendsEmail() {
//         // Given
//         when(accountRepository.existsByEmail(validRegisterRequest.email())).thenReturn(false);
//         when(passwordEncoder.encode(validRegisterRequest.password())).thenReturn("hashedPassword");
//         when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> {
//             Account saved = invocation.getArgument(0);
//             saved.setId(UUID.randomUUID());
//             return saved;
//         });

//         // When
//         authService.register(validRegisterRequest);

//         // Then
//         verify(accountRepository).save(accountCaptor.capture());
//         verify(verificationTokenRepository).save(tokenCaptor.capture());
//         verify(emailService).sendVerificationEmail(any(Account.class), any(String.class));

//         Account savedAccount = accountCaptor.getValue();
//         assertThat(savedAccount.getEmail()).isEqualTo(validRegisterRequest.email());
//         assertThat(savedAccount.getPasswordHash()).isEqualTo("hashedPassword");
//         assertThat(savedAccount.getRole()).isEqualTo(Role.CUSTOMER);
//         assertThat(savedAccount.isEnabled()).isFalse(); // Disabled until email verified
//         assertThat(savedAccount.isEmailVerified()).isFalse();
//         assertThat(savedAccount.getProfile()).isNotNull();
//         assertThat(savedAccount.getProfile().getFirstName()).isEqualTo("John");
//         assertThat(savedAccount.getProfile().getLastName()).isEqualTo("Doe");

//         VerificationToken savedToken = tokenCaptor.getValue();
//         assertThat(savedToken.getToken()).isNotNull();
//         assertThat(savedToken.getAccount()).isEqualTo(savedAccount);
//         assertThat(savedToken.getExpiryDate()).isAfter(LocalDateTime.now());
//     }

//     @Test
//     @DisplayName("register - email already exists throws exception")
//     void register_emailAlreadyExists_throwsException() {
//         // Given
//         when(accountRepository.existsByEmail(validRegisterRequest.email())).thenReturn(true);

//         // When/Then
//         assertThatThrownBy(() -> authService.register(validRegisterRequest))
//                 .isInstanceOf(IllegalArgumentException.class)
//                 .hasMessageContaining("Email already exists");

//         // Verify no account was saved
//         verify(accountRepository, never()).save(any(Account.class));
//         verify(verificationTokenRepository, never()).save(any(VerificationToken.class));
//         verify(emailService, never()).sendVerificationEmail(any(), any());
//     }

//     @Test
//     @DisplayName("register - password is encoded before saving")
//     void register_passwordIsEncoded() {
//         // Given
//         String rawPassword = "mySecretPassword";
//         String encodedPassword = "encodedSecretHash123";

//         RegisterRequest request = new RegisterRequest(
//                 "newuser@example.com", rawPassword, "Test", "User", "0909999999");

//         when(accountRepository.existsByEmail(request.email())).thenReturn(false);
//         when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
//         when(accountRepository.save(any(Account.class))).thenAnswer(i -> i.getArgument(0));

//         // When
//         authService.register(request);

//         // Then
//         verify(passwordEncoder).encode(rawPassword);
//         verify(accountRepository).save(accountCaptor.capture());
//         assertThat(accountCaptor.getValue().getPasswordHash()).isEqualTo(encodedPassword);
//     }

//     @Test
//     @DisplayName("register - verification token expires in 24 hours")
//     void register_tokenExpiresIn24Hours() {
//         // Given
//         when(accountRepository.existsByEmail(validRegisterRequest.email())).thenReturn(false);
//         when(passwordEncoder.encode(any())).thenReturn("hash");
//         when(accountRepository.save(any(Account.class))).thenAnswer(i -> i.getArgument(0));

//         LocalDateTime beforeRegister = LocalDateTime.now().plusHours(23).plusMinutes(59);
//         LocalDateTime afterRegister = LocalDateTime.now().plusHours(24).plusMinutes(1);

//         // When
//         authService.register(validRegisterRequest);

//         // Then
//         verify(verificationTokenRepository).save(tokenCaptor.capture());
//         LocalDateTime expiryDate = tokenCaptor.getValue().getExpiryDate();

//         assertThat(expiryDate).isAfter(beforeRegister);
//         assertThat(expiryDate).isBefore(afterRegister);
//     }

//     // ==================== VERIFY EMAIL TESTS ====================

//     @Test
//     @DisplayName("verifyEmail - success enables account and deletes token")
//     void verifyEmail_success_enablesAccountAndDeletesToken() {
//         // Given
//         String validToken = "valid-verification-token";
//         Account account = Account.builder()
//                 .email("user@example.com")
//                 .enabled(false)
//                 .emailVerified(false)
//                 .build();
//         account.setId(UUID.randomUUID());

//         VerificationToken verificationToken = VerificationToken.builder()
//                 .token(validToken)
//                 .account(account)
//                 .expiryDate(LocalDateTime.now().plusHours(1)) // Not expired
//                 .build();

//         when(verificationTokenRepository.findByToken(validToken)).thenReturn(Optional.of(verificationToken));
//         when(accountRepository.save(any(Account.class))).thenAnswer(i -> i.getArgument(0));

//         // When
//         authService.verifyEmail(validToken);

//         // Then
//         verify(accountRepository).save(accountCaptor.capture());
//         verify(verificationTokenRepository).delete(verificationToken);

//         Account updatedAccount = accountCaptor.getValue();
//         assertThat(updatedAccount.isEnabled()).isTrue();
//         assertThat(updatedAccount.isEmailVerified()).isTrue();
//     }

//     @Test
//     @DisplayName("verifyEmail - invalid token throws exception")
//     void verifyEmail_invalidToken_throwsException() {
//         // Given
//         String invalidToken = "non-existent-token";
//         when(verificationTokenRepository.findByToken(invalidToken)).thenReturn(Optional.empty());

//         // When/Then
//         assertThatThrownBy(() -> authService.verifyEmail(invalidToken))
//                 .isInstanceOf(IllegalArgumentException.class)
//                 .hasMessageContaining("Invalid verification token");

//         // Verify account was not modified
//         verify(accountRepository, never()).save(any(Account.class));
//         verify(verificationTokenRepository, never()).delete(any(VerificationToken.class));
//     }

//     @Test
//     @DisplayName("verifyEmail - expired token throws exception")
//     void verifyEmail_expiredToken_throwsException() {
//         // Given
//         String expiredToken = "expired-token";
//         Account account = Account.builder()
//                 .email("user@example.com")
//                 .enabled(false)
//                 .emailVerified(false)
//                 .build();
//         account.setId(UUID.randomUUID());

//         VerificationToken verificationToken = VerificationToken.builder()
//                 .token(expiredToken)
//                 .account(account)
//                 .expiryDate(LocalDateTime.now().minusMinutes(1)) // Expired
//                 .build();

//         when(verificationTokenRepository.findByToken(expiredToken)).thenReturn(Optional.of(verificationToken));

//         // When/Then
//         assertThatThrownBy(() -> authService.verifyEmail(expiredToken))
//                 .isInstanceOf(IllegalStateException.class)
//                 .hasMessageContaining("expired");

//         // Verify account was not modified
//         verify(accountRepository, never()).save(any(Account.class));
//     }

//     @Test
//     @DisplayName("verifyEmail - token at exact expiry boundary (edge case)")
//     void verifyEmail_tokenAtExpiryBoundary() {
//         // Given - Token expired 1 second ago
//         String boundaryToken = "boundary-token";
//         Account account = Account.builder()
//                 .email("user@example.com")
//                 .enabled(false)
//                 .emailVerified(false)
//                 .build();
//         account.setId(UUID.randomUUID());

//         VerificationToken verificationToken = VerificationToken.builder()
//                 .token(boundaryToken)
//                 .account(account)
//                 .expiryDate(LocalDateTime.now().minusSeconds(1)) // Just expired
//                 .build();

//         when(verificationTokenRepository.findByToken(boundaryToken)).thenReturn(Optional.of(verificationToken));

//         // When/Then - Should fail because it's past expiry
//         assertThatThrownBy(() -> authService.verifyEmail(boundaryToken))
//                 .isInstanceOf(IllegalStateException.class)
//                 .hasMessageContaining("expired");
//     }

//     @Test
//     @DisplayName("verifyEmail - already verified account can still verify (idempotent)")
//     void verifyEmail_alreadyVerifiedAccount_stillWorks() {
//         // Given - Account already verified but token still exists
//         String validToken = "valid-token";
//         Account account = Account.builder()
//                 .email("user@example.com")
//                 .enabled(true)
//                 .emailVerified(true) // Already verified
//                 .build();
//         account.setId(UUID.randomUUID());

//         VerificationToken verificationToken = VerificationToken.builder()
//                 .token(validToken)
//                 .account(account)
//                 .expiryDate(LocalDateTime.now().plusHours(1))
//                 .build();

//         when(verificationTokenRepository.findByToken(validToken)).thenReturn(Optional.of(verificationToken));
//         when(accountRepository.save(any(Account.class))).thenAnswer(i -> i.getArgument(0));

//         // When - Should not throw exception
//         authService.verifyEmail(validToken);

//         // Then - Token should be deleted
//         verify(verificationTokenRepository).delete(verificationToken);
//     }
// }
