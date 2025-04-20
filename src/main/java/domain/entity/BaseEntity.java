package domain.entity;


import jakarta.persistence.*;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import java.util.UUID;

@Getter
@MappedSuperclass
public class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(updatable = false, nullable = false)
    protected UUID id;
}
