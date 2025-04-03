package com.bookingonline.bookingonlineticket.controller;

import com.bookingonline.bookingonlineticket.model.Greeting;
import jakarta.websocket.server.PathParam;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("version1")
public class CustomerGreetingController {

    private static final String greetingTemplate = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();
    @GetMapping("/greeting")
    public Greeting greeting(@RequestParam(value ="gender", defaultValue= "0") boolean gender,
                            @RequestParam(value ="customerName", defaultValue = "Customer") String customerName) {


        return Greeting.builder()
                .id(counter.incrementAndGet())
                .content(String.format(greetingTemplate, gender ? "M" : "F",customerName))
                .build();

    }
}
