package org.application.booking.domain.aggregates.TripModel;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.common.BaseEntity;
import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.domain.aggregates.BusModel.Seat;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Table(name = "Trip")
@Entity
@Getter
@Setter
public class Trip extends BaseEntity {
    private float pricePerSeat;
    private String departure;
    private String destination;

    @Embedded
    private TimeFrame timeFrame;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="bus_id")
    private Bus bus;

    @Column(name = "bus_id", insertable = false, updatable = false)
    private UUID busId;

    @JsonManagedReference
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Ticket> tickets = new ArrayList<>();


    public Trip (float pricePerSeat, String departure, String destination, TimeFrame timeFrame, Bus bus) {
        this.pricePerSeat = pricePerSeat;
        this.departure = departure;
        this.destination = destination;
        this.timeFrame = timeFrame;
        this.bus = bus;
    }
    public Trip(){}

    public static Trip createTrip (String departure, String destination,
                                   float pricePerSeat , TimeFrame timeFrame, Bus bus){

        if (departure.equals(destination)){
            throw new IllegalArgumentException("Departure and destination are the same");
        }

        if (pricePerSeat <=0){
            throw new IllegalArgumentException("Price per seat should be greater than 0");
        }
        Trip trip = new Trip(pricePerSeat,departure,destination,timeFrame,bus);
        for (Seat seat: bus.getSeats()){
            Ticket ticket = new Ticket(seat,trip);
            trip.addTicket(ticket);
        }

        return trip;
    }

    private void addTicket(Ticket ticket){
        this.tickets.add(ticket);
    }
}

