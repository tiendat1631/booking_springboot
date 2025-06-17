package org.application.booking.domain.entity;

import jakarta.validation.constraints.Min;
import org.application.booking.domain.ValueObject.Email;
import org.application.booking.domain.ValueObject.Role;
import org.application.booking.domain.ValueObject.Username;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Embedded
    private Username username;
    @Embedded
    private Email email;

    @Column(unique = true, nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    @Min(10)
    private int age;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Session> sessions;

    public void addSession(Session session) {
        if (sessions == null) {
            sessions = new ArrayList<>();
        }
        sessions.add(session);
        session.setUser(this);
    }
    public void revokeSession(Session session) {
        if (sessions.contains(session)) {
            session.setRevoked(true);
        }
    }
}
