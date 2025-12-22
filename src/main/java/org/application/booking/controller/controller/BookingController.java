package org.application.booking.controller.controller;

import lombok.RequiredArgsConstructor;
import org.application.booking.domain.aggregates.BookingModel.Booking;
import org.application.booking.repository.BookedTicketRepository;
import org.application.booking.repository.BookingRepository;
import org.application.booking.service.booking.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/booking")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;
    private final BookedTicketRepository bookedTicketRepository;

    @GetMapping
    public List<Booking> getBooking(@RequestParam("userId") UUID userId) {
        return bookingRepository.findByUserId(userId);
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
