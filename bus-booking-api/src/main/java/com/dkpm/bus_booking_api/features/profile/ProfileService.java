package com.dkpm.bus_booking_api.features.profile;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dkpm.bus_booking_api.domain.security.models.Account;
import com.dkpm.bus_booking_api.domain.security.repositories.AccountRepository;
import com.dkpm.bus_booking_api.features.profile.dto.ProfileResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProfileService implements IProfileService {

    private final AccountRepository accountRepository;

    @Override
    public ProfileResponse getProfile(UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        return new ProfileResponse(
                account.getId(),
                account.getEmail(),
                account.getProfile() != null ? account.getProfile().getFirstName() : null,
                account.getProfile() != null ? account.getProfile().getLastName() : null,
                account.getProfile() != null ? account.getProfile().getPhoneNumber() : null,
                account.getRole().name(),
                account.isEmailVerified());
    }
}
