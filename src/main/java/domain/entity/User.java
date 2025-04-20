package domain.entity;

import domain.ValueObject.Email;
import domain.ValueObject.Role;
import domain.ValueObject.Username;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {

    private String name;
    private Username username;
    private Email email;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Session> sessions;

    public void addSession(Session session) {
        sessions.add(session);
        session.setUser(this);
    }
    public void revokeSession(Session session) {
        if (sessions.contains(session)) {
            session.setRevoked(true);
        }
    }
}
