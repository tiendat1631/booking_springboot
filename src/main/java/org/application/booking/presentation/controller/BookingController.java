package org.application.booking.presentation.controller;

import lombok.AllArgsConstructor;
import org.application.booking.application.feature.booking.CreateBookingRequest;
import org.application.booking.application.feature.booking.CreateBookingUseCase;
import org.application.booking.domain.aggregates.BookingModel.Booking;
import org.application.booking.repository.BookingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/booking")
@AllArgsConstructor
public class BookingController {

    private final CreateBookingUseCase createBookingUseCase;
    private final BookingRepository bookingRepository;


    @PostMapping
    public ResponseEntity<String> createBooking(@RequestBody CreateBookingRequest bookingRequest) {
        createBookingUseCase.book(bookingRequest);
        return ResponseEntity.ok("Booking created successfully.");
    }


    @GetMapping
    public List<Booking> getBooking(@RequestParam("userId") UUID userId) {
        return bookingRepository.findByUserId(userId);
    }


    @GetMapping("/all")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable UUID id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        return booking.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable UUID id) {
        if (!bookingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bookingRepository.deleteById(id);
        return ResponseEntity.ok("Booking deleted successfully.");
    }
}
