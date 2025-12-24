package com.dkpm.bus_booking_api.config;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/check-auth")
    public String getCheckAuth() {
        return "Authenticated access successful.";
    }
}
