
package org.application.booking.presentation.controller;

import lombok.AllArgsConstructor;
import org.application.booking.application.feature.booking.CreateBookingRequest;
import org.application.booking.application.feature.booking.CreateBookingUseCase;
import org.application.booking.domain.aggregates.BookingModel.Booking;
import org.application.booking.repository.BookingRepository;
import org.hibernate.annotations.Parameter;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/booking")
@AllArgsConstructor
public class BookingController {
    private final CreateBookingUseCase createBookingUseCase;
    private final BookingRepository bookingRepository;

    @PostMapping
    public void createBooking(@RequestBody CreateBookingRequest bookingRequest) {
        createBookingUseCase.book(bookingRequest);
    }

    @GetMapping
    public List<Booking> getBooking(@RequestParam("userId") UUID userId){
        return bookingRepository.findByUserId(userId);
    }
}

