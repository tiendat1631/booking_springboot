package com.dkpm.bus_booking_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode;

import com.dkpm.bus_booking_api.config.AppProperties;
import com.dkpm.bus_booking_api.config.RsaKeyProperties;
import com.dkpm.bus_booking_api.config.JwtProperties;
import com.dkpm.bus_booking_api.config.VnpayProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableJpaAuditing
@EnableConfigurationProperties({ AppProperties.class, RsaKeyProperties.class, JwtProperties.class,
		VnpayProperties.class })
@EnableSpringDataWebSupport(pageSerializationMode = PageSerializationMode.VIA_DTO)
public class BusBookingApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(BusBookingApiApplication.class, args);
	}

}
