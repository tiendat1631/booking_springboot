package org.application.booking;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class BookingApplicationTests {

    @Test
    void contextLoads() {
        System.out.println("Running testing ...................");
    }

}
