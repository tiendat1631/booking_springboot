package com.dkpm.bus_booking_api.infrastructure.seeding;

import com.dkpm.bus_booking_api.domain.security.models.Account;
import com.dkpm.bus_booking_api.domain.security.models.Role;
import com.dkpm.bus_booking_api.domain.security.repositories.AccountRepository;
import com.dkpm.bus_booking_api.domain.user.Profile;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class DataSeedingConfig {

    @Bean
    @Transactional
    public CommandLineRunner mockData(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String email = "admin@example.com";

            if (accountRepository.findByEmail(email).isEmpty()) {

                Account account = Account.builder()
                        .email(email)
                        .passwordHash(passwordEncoder.encode("Admin@123"))
                        .role(Role.ADMIN)
                        .enabled(true)
                        .build();

                Profile profile = Profile.builder()
                        .firstName("Admin")
                        .lastName("User")
                        .phoneNumber("1234567890")
                        .build();

                profile.setAccount(account);
                account.setProfile(profile);

                accountRepository.save(account);

                System.out.println("===== Mock Admin user created: " + email + " =====");
            }
        };
    }
}
