package infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import domain.entity.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {

}
