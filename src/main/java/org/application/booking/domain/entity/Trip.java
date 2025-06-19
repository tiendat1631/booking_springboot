
package org.application.booking.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.entity.BusBoundary.Bus;
import org.application.booking.domain.entity.BusBoundary.Seat;

import java.util.ArrayList;
import java.util.List;

@Table(name = "Trip")
@Entity
@Getter
@Setter

public class Trip extends BaseEntity{
    private float pricePerSeat;
    private String departure;
    private String destination;

    //@Embedded
    //private TimeFrame frame;
    private String timeFrame;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="bus_id", nullable = false)
    private Bus bus;


    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Ticket> tickets = new ArrayList<>();
    @JsonIgnore
    public List<Seat> getSeats(){
        // if bus = null -> error
        return (bus != null) ? bus.getSeats() : new ArrayList<>();
    }
    public Trip (float pricePerSeat, String departure, String destination, String timeFrame, Bus bus) {
        this.pricePerSeat = pricePerSeat;
        this.departure = departure;
        this.destination = destination;
        this.timeFrame = timeFrame;
        this.bus = bus;
    }
    public Trip(){}

    public static Trip createTrip (String departure, String destination,
                                   float pricePerSeat , String timeFrame, Bus bus){
        if (departure.equals(destination)){
            throw new IllegalArgumentException("Departure and destination are the same");
        }

        if (pricePerSeat <= 0){
            throw new IllegalArgumentException("Price per seat should be greater than 0");
        }

        return new Trip(pricePerSeat, departure, destination, timeFrame, bus);
    }

    public List<Ticket> generateTicketsFromSeats(List<Seat> seats) {
        List<Ticket> tickets = new ArrayList<>();
        for (Seat seat : seats) {
            tickets.add(new Ticket(seat, this));
        }
        return tickets;
    }

}

