package org.application.booking.domain.aggregates.UserModel;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.application.booking.domain.common.BaseEntity;

import java.time.LocalDateTime;

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

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(nullable = false)
    @Min(10)
    private int age;

    @Override
    protected void handleBeforeCreate() {
        this.createdAt = LocalDateTime.now();
        this.createdBy = this.username.getUsername();
    }
}
