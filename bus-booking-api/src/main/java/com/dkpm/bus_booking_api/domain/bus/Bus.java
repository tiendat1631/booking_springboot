package com.dkpm.bus_booking_api.domain.bus;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.dkpm.bus_booking_api.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PostUpdate;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "buses")
@Getter
@Setter
public class Bus extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String licensePlate;

    @Enumerated(EnumType.STRING)
    private BusType type;

    @Enumerated(EnumType.STRING)
    private BusStatus status;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "seat_layout", columnDefinition = "json")
    private SeatLayout seatLayout;

    @Column(name = "total_seats")
    private int totalSeats;

    @PrePersist
    @PostUpdate
    public void calculateTotalSeats() {
        if (this.seatLayout != null && this.seatLayout.getSeats() != null) {
            this.totalSeats = this.seatLayout.getSeats().size();
        }
    }
}
