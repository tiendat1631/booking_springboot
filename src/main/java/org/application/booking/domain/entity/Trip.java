
package org.application.booking.domain.entity;

import org.application.booking.domain.ValueObject.TimeFrame;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
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
    @ManyToOne
    @JoinColumn(name="bus_id")
    private Bus bus;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ticket> tickets = new ArrayList<>();

    public List<Seat> getSeats(){
        return this.bus.getSeats();
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
                                   float pricePerSeat , String timeFrameame, Bus bus){

        if (departure.equals(destination)){
            throw new IllegalArgumentException("Departure and destination are the same");
        }

        if (pricePerSeat <=0){
            throw new IllegalArgumentException("Price per seat should be greater than 0");
        }
        Trip trip = new Trip(pricePerSeat,departure,destination,timeFrameame,bus);
        for (Seat seat: trip.getSeats()){
            Ticket ticket = new Ticket(seat,trip);
            trip.getTickets().add(ticket);
        }
        return trip;
    }
    public Float totalPrice(int numberOfSeats){
        return this.pricePerSeat * numberOfSeats;
    }
}

