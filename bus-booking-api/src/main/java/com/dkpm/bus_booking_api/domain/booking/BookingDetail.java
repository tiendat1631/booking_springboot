package com.dkpm.bus_booking_api.domain.booking;

import java.math.BigDecimal;

import com.dkpm.bus_booking_api.domain.common.BaseEntity;
import com.dkpm.bus_booking_api.domain.trip.Ticket;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "booking_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDetail extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Column(name = "seat_id", nullable = false, length = 10)
    private String seatId;

    @Column(name = "seat_price", precision = 12, scale = 2, nullable = false)
    private BigDecimal seatPrice;
}
