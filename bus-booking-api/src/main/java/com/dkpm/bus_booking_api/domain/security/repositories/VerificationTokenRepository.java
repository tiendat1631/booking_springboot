package com.dkpm.bus_booking_api.domain.security.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dkpm.bus_booking_api.domain.security.models.Account;
import com.dkpm.bus_booking_api.domain.security.models.VerificationToken;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, UUID> {
    Optional<VerificationToken> findByToken(String token);

    void deleteByAccount(Account account);
}
