package com.dkpm.bus_booking_api.domain.trip;

import java.math.BigDecimal;

import com.dkpm.bus_booking_api.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tickets", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "trip_id", "seat_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name = "seat_id", nullable = false, length = 10)
    private String seatId;

    @Column(name = "seat_row")
    private int row;

    @Column(name = "seat_col")
    private int col;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SeatStatus status = SeatStatus.AVAILABLE;

    @Column(name = "price", precision = 12, scale = 2, nullable = false)
    private BigDecimal price;

    @Version
    private Long version;

    /**
     * Check if seat can be reserved
     */
    public boolean isAvailable() {
        return this.status == SeatStatus.AVAILABLE;
    }

    /**
     * Reserve the seat (for pending booking)
     */
    public void reserve() {
        if (!isAvailable()) {
            throw new IllegalStateException("Seat " + seatId + " is not available");
        }
        this.status = SeatStatus.RESERVED;
    }

    /**
     * Book the seat (after payment)
     */
    public void book() {
        if (this.status != SeatStatus.RESERVED) {
            throw new IllegalStateException("Seat " + seatId + " is not reserved");
        }
        this.status = SeatStatus.BOOKED;
    }

    /**
     * Release the seat (cancel reservation)
     */
    public void release() {
        if (this.status == SeatStatus.RESERVED || this.status == SeatStatus.BOOKED) {
            this.status = SeatStatus.AVAILABLE;
        }
    }
}
