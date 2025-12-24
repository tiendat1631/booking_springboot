package com.dkpm.bus_booking_api.domain.station;

import com.dkpm.bus_booking_api.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "stations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Station extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false, length = 10)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String province;

    private Double latitude;

    private Double longitude;

    @Builder.Default
    @Column(name = "is_active")
    private boolean active = true;
}
