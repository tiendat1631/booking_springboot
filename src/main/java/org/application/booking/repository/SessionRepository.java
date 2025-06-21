package org.application.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.application.booking.domain.aggregates.UserModel.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {

}
