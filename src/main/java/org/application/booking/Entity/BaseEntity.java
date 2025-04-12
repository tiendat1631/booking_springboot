package org.application.booking.Entity;


import jakarta.persistence.*;

import jakarta.persistence.MappedSuperclass;

import java.util.UUID;
@MappedSuperclass
public class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    protected UUID id;


}
