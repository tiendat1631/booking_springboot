/*
package org.application.booking.presentation.controller;

import org.application.booking.application.feature.BookingUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.application.booking.application.feature.booking.BookingRequest;
import org.application.booking.presentation.DTO.BookingResponse;

@RestController
@RequestMapping("/bookings")

public class BookingController {

    private final BookingUseCase bookingUseCase;

    public BookingController(BookingUseCase bookingUseCase) {
        this.bookingUseCase = bookingUseCase;
    }
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest bookingRequest) {
        BookingResponse bookingResponse = bookingUseCase.excute(bookingRequest);
        return ResponseEntity.ok(bookingResponse);
    }

}
*/
