package com.dkpm.bus_booking_api.domain.trip;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.dkpm.bus_booking_api.domain.bus.Bus;
import com.dkpm.bus_booking_api.domain.common.BaseEntity;
import com.dkpm.bus_booking_api.domain.route.Route;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "trips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @Column(name = "departure_time", nullable = false)
    private LocalDateTime departureTime;

    @Column(name = "arrival_time", nullable = false)
    private LocalDateTime arrivalTime;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TripStatus status = TripStatus.SCHEDULED;

    @Column(name = "total_seats")
    private int totalSeats;

    @Column(name = "available_seats")
    private int availableSeats;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TripSeat> tripSeats = new ArrayList<>();

    @Version
    private Long version;

    /**
     * Calculate trip duration in minutes
     */
    public int getDurationMinutes() {
        if (departureTime != null && arrivalTime != null) {
            return (int) java.time.Duration.between(departureTime, arrivalTime).toMinutes();
        }
        return 0;
    }

    /**
     * Update available seats count based on trip seats
     */
    public void updateAvailableSeats() {
        this.availableSeats = (int) tripSeats.stream()
                .filter(seat -> seat.getStatus() == SeatStatus.AVAILABLE)
                .count();
    }

    /**
     * Add a trip seat to this trip
     */
    public void addTripSeat(TripSeat tripSeat) {
        tripSeats.add(tripSeat);
        tripSeat.setTrip(this);
    }
}
