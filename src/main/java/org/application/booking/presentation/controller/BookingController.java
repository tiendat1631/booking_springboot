package org.application.booking.presentation.controller;

import lombok.AllArgsConstructor;
import org.application.booking.application.feature.booking.CreateBookingRequest;
import org.application.booking.application.feature.booking.CreateBookingUseCase;
import org.application.booking.application.feature.booking.UpdateBookingRequest;
import org.application.booking.application.feature.booking.UpdateBookingUseCase;
import org.application.booking.domain.aggregates.BookingModel.Booking;
import org.application.booking.repository.BookedTicketRepository;
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
    private final UpdateBookingUseCase updateBookingUseCase; // ✅ NEW
    private final BookingRepository bookingRepository;
    private final BookedTicketRepository bookedTicketRepository;

    @PostMapping
    public ResponseEntity<String> createBooking(@RequestBody CreateBookingRequest bookingRequest) {
        createBookingUseCase.book(bookingRequest);
        return ResponseEntity.ok("Booking created successfully.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateBooking(@PathVariable UUID id,
                                                @RequestBody UpdateBookingRequest request) {
        try {
            updateBookingUseCase.updateBooking(id, request);
            return ResponseEntity.ok("Booking updated successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Không thể cập nhật booking.");
        }
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
