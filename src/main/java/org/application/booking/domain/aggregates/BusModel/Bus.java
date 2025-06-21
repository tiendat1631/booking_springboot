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

    public Bus(int numberOfSeats, BusType type) {

        this.numberOfSeats = numberOfSeats;
        this.type = type;
        this.seats = new ArrayList<>();

        //logic tao seat khi tao bus
        for(int i = 0; i < numberOfSeats; i++){
            seats.add(new Seat(this));
        }
    }



    protected Bus() {

    } //lombok
}
