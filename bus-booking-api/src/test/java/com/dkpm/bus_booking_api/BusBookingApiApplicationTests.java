package com.dkpm.bus_booking_api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import com.dkpm.bus_booking_api.config.TestConfig;

@SpringBootTest
@Import(TestConfig.class)
class BusBookingApiApplicationTests {

	@Test
	void contextLoads() {
	}

}
