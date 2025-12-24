package com.dkpm.bus_booking_api.domain.user;

import java.util.UUID;

import com.dkpm.bus_booking_api.domain.security.Account;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {
    @Id
    @Column(name = "account_id")
    private UUID id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "account_id")
    private Account account;

    private String firstName;

    private String lastName;

    private String phoneNumber;
}