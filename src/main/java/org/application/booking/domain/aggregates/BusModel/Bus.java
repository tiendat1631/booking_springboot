package org.application.booking.domain.aggregates.BusModel;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AccessLevel;
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
    @Column(unique = true)
    private String licensePlate;

    @Enumerated(EnumType.STRING)
    public BusType type;

    @Setter(AccessLevel.NONE)
    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Seat> seats;

    @Setter(AccessLevel.NONE)
    private int capacity;

    private Bus(BusType type, String licensePlate) {
        this.licensePlate = licensePlate;
        this.type = type;
    }

    public static Bus Create(BusType type, String licensePlate){
        Bus bus = new Bus(type, licensePlate);
        bus.GenerateSeat();

        return bus;
    }

    private void GenerateSeat(){
        this.seats = new ArrayList<>();

        if (type==BusType.normal){
            this.capacity = 40;
        }else if (type==BusType.limousine){
            this.capacity = 22;
        }else {
            this.capacity = 0;
        }

        for(int i = 0; i < capacity; i++){
            seats.add(new Seat(this));
        }
    }

    protected Bus() {}
}
