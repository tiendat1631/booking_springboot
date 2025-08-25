package org.application.booking.domain.aggregates.TripModel;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

@Value
@Embeddable
public class Province {
    @NotNull String name;
    @NotNull int code;
    @NotNull String codename;

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
