package org.application.booking.domain.aggregates.TripModel;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.application.booking.domain.common.BaseEntity;
import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.domain.aggregates.BusModel.Seat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Table(name = "Trip")
@Entity
@Getter
@Setter
@Builder(access = AccessLevel.PRIVATE)

public class Trip extends BaseEntity {
    private float ticketPrice;

    @Embedded
    private Route route;

    private LocalDateTime departureTime;
    private LocalDateTime estimatedArrivalTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @JsonManagedReference
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Ticket> tickets;

    public static Trip Create(Route route, Bus bus, LocalDateTime departureTime, LocalDateTime estimatedArrivalTime, float ticketPrice){
        Trip trip = Trip.builder()
                .route(route)
                .bus(bus)
                .departureTime(departureTime)
                .estimatedArrivalTime(estimatedArrivalTime)
                .ticketPrice(ticketPrice)
                .build();

        trip.GenerateTickets();
        return trip;
    }

    private void GenerateTickets(){
        this.tickets = bus.getSeats().stream()
                .map(seat -> new Ticket(seat, this))
                .toList();
    }
}

