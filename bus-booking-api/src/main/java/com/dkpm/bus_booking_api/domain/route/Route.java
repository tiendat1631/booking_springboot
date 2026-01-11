package com.dkpm.bus_booking_api.domain.route;

import java.math.BigDecimal;

import com.dkpm.bus_booking_api.domain.common.BaseEntity;
import com.dkpm.bus_booking_api.domain.station.Province;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "routes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Route extends BaseEntity {

        @Column(nullable = false)
        private String name;

        @Column(unique = true, nullable = false, length = 20)
        private String code;

        @Embedded
        @AttributeOverrides({
                        @AttributeOverride(name = "code", column = @Column(name = "departure_province_code")),
                        @AttributeOverride(name = "name", column = @Column(name = "departure_province_name")),
                        @AttributeOverride(name = "codename", column = @Column(name = "departure_province_codename"))
        })
        private Province departureProvince;

        @Embedded
        @AttributeOverrides({
                        @AttributeOverride(name = "code", column = @Column(name = "destination_province_code")),
                        @AttributeOverride(name = "name", column = @Column(name = "destination_province_name")),
                        @AttributeOverride(name = "codename", column = @Column(name = "destination_province_codename"))
        })
        private Province destinationProvince;

        @Column(name = "distance_km")
        private Integer distanceKm;

        @Column(name = "estimated_duration_minutes")
        private Integer estimatedDurationMinutes;

        @Column(name = "base_price", precision = 12, scale = 2)
        private BigDecimal basePrice;

        @Builder.Default
        @Column(name = "is_active")
        private boolean active = true;
}
