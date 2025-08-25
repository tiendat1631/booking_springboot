package org.application.booking.domain.common;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.security.SecurityUtil;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(updatable = false, nullable = false)
    protected UUID id;

    protected LocalDateTime createdAt;

    protected LocalDateTime updatedAt;

    protected String createdBy;

    protected String updatedBy;

    // ===== Lưu người tạo ra entity =====
    @PrePersist
    protected void handleBeforeCreate() {
        this.createdAt = LocalDateTime.now();
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() ?
                SecurityUtil.getCurrentUserLogin().get() : "";
    }

    // ===== Lưu người cập nhật entity =====
    @PreUpdate
    protected void handleBeforeUpdate() {
        this.updatedAt = LocalDateTime.now();
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() ?
                SecurityUtil.getCurrentUserLogin().get() : "";
    }

}
