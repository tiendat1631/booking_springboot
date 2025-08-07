package org.application.booking.domain.aggregates.TripModel;

import jakarta.persistence.*;
import lombok.Value;
import org.application.booking.application.feature.trip.exception.SameProvinceRouteException;

@Value
@Embeddable
public class Route {
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "name", column = @Column(name = "departure_name")),
            @AttributeOverride(name = "code", column = @Column(name = "departure_code")),
            @AttributeOverride(name = "codename", column = @Column(name = "departure_codename"))
    })
    Province departure;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "name", column = @Column(name = "destination_name")),
            @AttributeOverride(name = "code", column = @Column(name = "destination_code")),
            @AttributeOverride(name = "codename", column = @Column(name = "destination_codename"))
    })
    Province destination;

    public Route(Province departure, Province destination) {
        if (departure != null && destination != null && departure.getCode() == (destination.getCode()))
            throw new SameProvinceRouteException();

        this.departure = departure;
        this.destination = destination;
    }

    // ===== JPA Constructure =====
    private Route() {
        this.departure = null;
        this.destination = null;
    }
}
