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
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bus> buses = new ArrayList<>();


    @JsonManagedReference
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Ticket> tickets = new ArrayList<>();


    public Trip (float pricePerSeat , String departure, String destination, TimeFrame timeFrame, List<Bus> buses) {
        this.pricePerSeat = pricePerSeat;
        this.departure = departure;
        this.destination = destination;
        this.timeFrame = timeFrame;
        this.buses = buses;
    }
    public Trip(){}

    public static Trip createTrip (String departure, String destination,
                                   float pricePerSeat , TimeFrame timeFrame, List<Bus> buses){

        if (departure.equals(destination)){
            throw new IllegalArgumentException("Departure and destination are the same");
        }

        if (pricePerSeat <=0){
            throw new IllegalArgumentException("Price per seat should be greater than 0");
        }
        Trip trip = new Trip(pricePerSeat,departure,destination,timeFrame, buses);

        for (Bus bus : buses){
            for (Seat seat: bus.getSeats()){
                Ticket ticket = new Ticket(seat,trip);
                trip.addTicket(ticket);
            }
        }

        return trip;
    }

    private void addTicket(Ticket ticket){
        this.tickets.add(ticket);
    }
}

