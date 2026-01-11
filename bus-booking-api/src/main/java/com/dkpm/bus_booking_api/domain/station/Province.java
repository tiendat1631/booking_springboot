package com.dkpm.bus_booking_api.domain.station;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Province {
    @Column(name = "province_code")
    private Integer code;

    @Column(name = "province_name")
    private String name;

    @Column(name = "province_codename")
    private String codename;
}
