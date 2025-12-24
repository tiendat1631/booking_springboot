package com.dkpm.bus_booking_api.features.booking;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dkpm.bus_booking_api.domain.booking.BookingStatus;
import com.dkpm.bus_booking_api.features.booking.dto.BookingResponse;
import com.dkpm.bus_booking_api.features.booking.dto.CreateBookingRequest;
import com.dkpm.bus_booking_api.infrastructure.security.AccountPrincipal;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final IBookingService bookingService;

    /**
     * Create a new booking
     */
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            @AuthenticationPrincipal AccountPrincipal principal) {

        UUID customerId = principal != null ? principal.getId() : null;
        BookingResponse booking = bookingService.createBooking(request, customerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    /**
     * Get my bookings (authenticated)
     */
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal AccountPrincipal principal,
            @PageableDefault(size = 10, sort = "bookingTime", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<BookingResponse> bookings = bookingService.getCustomerBookings(principal.getId(), pageable);
        return ResponseEntity.ok(bookings);
    }

    /**
     * Get booking by ID
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable UUID bookingId) {
        BookingResponse booking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(booking);
    }

    /**
     * Get booking by code (public lookup)
     */
    @GetMapping("/code/{bookingCode}")
    public ResponseEntity<BookingResponse> getBookingByCode(@PathVariable String bookingCode) {
        BookingResponse booking = bookingService.getBookingByCode(bookingCode);
        return ResponseEntity.ok(booking);
    }

    /**
     * Cancel a booking
     */
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable UUID bookingId,
            @AuthenticationPrincipal AccountPrincipal principal) {

        UUID customerId = principal != null ? principal.getId() : null;
        BookingResponse booking = bookingService.cancelBooking(bookingId, customerId);
        return ResponseEntity.ok(booking);
    }

    /**
     * Search bookings (Admin)
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<BookingResponse>> searchBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "bookingTime", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<BookingResponse> bookings = bookingService.searchBookings(status, keyword, pageable);
        return ResponseEntity.ok(bookings);
    }

    /**
     * Admin cancel booking
     */
    @PutMapping("/admin/{bookingId}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> adminCancelBooking(@PathVariable UUID bookingId) {
        BookingResponse booking = bookingService.cancelBooking(bookingId, null);
        return ResponseEntity.ok(booking);
    }
}
