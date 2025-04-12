package org.application.booking.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import javax.management.relation.Role;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User extends BaseEntity {

    private String name;
    private String email;
    private String password;
    private Role role;
    private int age;

}
