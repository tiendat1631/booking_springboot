
package org.application.booking.domain.entity;

import org.application.booking.domain.ValueObject.TimeFrame;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.application.booking.domain.entity.BusBoundary.Bus;
import org.application.booking.domain.entity.BusBoundary.Seat;

import java.util.List;

@Table(name = "Trip")
@Entity
@Getter
@Setter
@RequiredArgsConstructor
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


    public List<Seat> getSeats(){
        return bus.getSeats();
    }

    public static Trip createTrip (String departure, String destination,
                                   float pricePerSeat , String timeFrameame, Bus bus){
        Trip trip = new Trip();
        trip.setDeparture(departure);
        trip.setDestination(destination);
        if (departure.equals(destination)){
            throw new IllegalArgumentException("Departure and destination are the same");
        }
        trip.setPricePerSeat(pricePerSeat);
        if (pricePerSeat <=0){
            throw new IllegalArgumentException("Price per seat should be greater than 0");
        }
        trip.setTimeFrame(timeFrameame);
        trip.setBus(bus);
        return trip;
    }
}

