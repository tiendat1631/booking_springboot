package org.application.booking.domain.aggregates.UserModel;

import jakarta.persistence.*;
import lombok.*;
import org.application.booking.domain.common.BaseEntity;

import java.time.Instant;

@Entity
@Table(name = "session")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Session extends BaseEntity {
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    @Column(updatable = false, nullable = false)
//    private String id;

    @Column(nullable = false, unique = true)
    private String token;
    private Instant createdAt;
    private Instant expiresAt;
    private boolean revoked;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
