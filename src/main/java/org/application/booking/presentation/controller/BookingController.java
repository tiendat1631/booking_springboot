package org.application.booking.presentation.controller;

import lombok.AllArgsConstructor;
import org.application.booking.application.feature.booking.CreateBookingRequest;
import org.application.booking.application.feature.booking.BookingService;
import org.application.booking.domain.aggregates.BookingModel.Booking;
import org.application.booking.presentation.ApiResponse;
import org.application.booking.repository.BookedTicketRepository;
import org.application.booking.repository.BookingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/booking")
@AllArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;
    private final BookedTicketRepository bookedTicketRepository;

    @GetMapping
    public List<Booking> getBooking(@RequestParam("userId") UUID userId) {
        return bookingRepository.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> createBooking(@RequestBody CreateBookingRequest bookingRequest) {
        bookingService.book(bookingRequest);
        ApiResponse<Object> response = ApiResponse.success("Booking created successfully.", null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
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

        try {
            bookedTicketRepository.deleteByBookingId(id);
            bookingRepository.deleteById(id);
            return ResponseEntity.ok("Booking deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Không thể xoá booking do ràng buộc dữ liệu.");
        }
    }
}
