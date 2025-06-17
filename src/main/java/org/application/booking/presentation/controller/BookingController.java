
package org.application.booking.presentation.controller;

import lombok.AllArgsConstructor;
import org.application.booking.application.feature.booking.CreateBookingRequest;
import org.application.booking.application.feature.booking.CreateBookingUseCase;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/booking")
@AllArgsConstructor
public class BookingController {
    private final CreateBookingUseCase createBookingUseCase;

    @PostMapping
    public void createBooking(@RequestBody CreateBookingRequest bookingRequest) {
        createBookingUseCase.book(bookingRequest);
    }

}

