package org.application.booking.domain.aggregates.BusModel;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.application.booking.domain.common.BaseEntity;

import java.util.ArrayList;
import java.util.List;
@Table(name = "bus")
@Entity
@Getter
@Setter
@AllArgsConstructor
public class Bus extends BaseEntity {
    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL, orphanRemoval = false, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Seat> seats; // seat available

    private int numberOfSeats;

    @Enumerated(EnumType.STRING)
    public BusType type;

    public Bus(BusType type) {
        this.type = type;
        if (type==BusType.normal){
            this.numberOfSeats = 40;
        }else if (type==BusType.limousine){
            this.numberOfSeats = 22;
        }else {
            this.numberOfSeats = 0;
        }
        this.seats = new ArrayList<>();

        //logic tao seat khi tao bus
        for(int i = 0; i < numberOfSeats; i++){
            seats.add(new Seat(this));
        }
    }



    protected Bus() {

    } //lombok
}
