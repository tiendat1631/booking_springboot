package org.application.booking.Repository;

import org.application.booking.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    // find user by id
    Optional<User> findByusername(String username);

    // check exist userName
    boolean existsByUsername(String username);
}
