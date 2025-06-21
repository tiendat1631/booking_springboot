package org.application.booking.repository;

import org.application.booking.domain.aggregates.UserModel.Email;
import org.application.booking.domain.aggregates.UserModel.Username;
import org.application.booking.domain.aggregates.UserModel.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    // find user by id
    Optional<User> findByUsername(Username username);
    boolean existsByUsername(Username username);
    boolean existsByEmail(Email email);
}
