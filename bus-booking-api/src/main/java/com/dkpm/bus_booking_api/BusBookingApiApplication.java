package com.dkpm.bus_booking_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode;

import com.dkpm.bus_booking_api.config.RsaKeyProperties;

@SpringBootApplication
@EnableJpaAuditing
@EnableConfigurationProperties(RsaKeyProperties.class)
@EnableSpringDataWebSupport(pageSerializationMode = PageSerializationMode.VIA_DTO)
public class BusBookingApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(BusBookingApiApplication.class, args);
	}

}
