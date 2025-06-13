/*
package org.application.booking.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.application.booking.domain.entity.BusBoundary.Seat;

import java.time.LocalDate;
import java.util.List;

@Table(name = "Booking")
@Getter
@Setter
@Entity
@RequiredArgsConstructor
public class Booking extends BaseEntity {
    private float totalPrice;
    private LocalDate timeCreate;

    @OneToMany(mappedBy = "booking",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Seat> seats; // 1 booking biet dc ds cac seats

    @ManyToOne
    private Trip trip;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public void addSeat(Seat seat) {
        if (!seat.isOccupied()) {
            seats.add(seat);
            seat.setOccupied(true); // mark this seat is occupied;
            //seat.setBooking(this);// quan he nguoc
            calculateTotalCost(); // update total cost after adding seat
        }else {
            throw new RuntimeException("Seat is occupied");
        }
    }
    public void calculateTotalCost() {
        if (seats!=null && trip!=null ) {
            this.totalPrice= trip.getPricePerSeat()*seats.size();
        }else{
            this.totalPrice=0;
        }
    }
}
*/
