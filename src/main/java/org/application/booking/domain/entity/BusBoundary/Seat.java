package org.application.booking.domain.entity.BusBoundary;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.entity.BaseEntity;

@Getter
@Setter
@Entity

public class Seat extends BaseEntity {
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="bus_id", nullable = false)
    private Bus bus;
    public Seat(Bus bus) {
        this.bus = bus;
    }

    public Seat() {

    }
}
