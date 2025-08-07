package org.application.booking.domain.aggregates.TripModel;

import jakarta.persistence.Embeddable;
import lombok.Value;

@Value
@Embeddable
public class Province {
    String name;
    int code;
    String codename;

    public Province(String name, int code, String codename) {
        this.name = name;
        this.code = code;
        this.codename = codename;
    }

    // ===== JPA Constructure =====
    private Province() {
        this.name = null;
        this.code = 0;
        this.codename = null;
    }
}
