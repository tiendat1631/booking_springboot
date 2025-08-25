package org.application.booking.controller.user;

import lombok.RequiredArgsConstructor;
import org.application.booking.controller.ApiResponse;
import org.application.booking.controller.dto.CreateBookingForUserRequest;
import org.application.booking.service.booking.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("UserBookingController")
@RequiredArgsConstructor
@RequestMapping("/api/v1/booking")
@PreAuthorize("hasRole('USER')")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> createBooking(@RequestBody CreateBookingForUserRequest bookingRequest) {
        bookingService.book(bookingRequest);
        ApiResponse<Object> response = ApiResponse.success("Booking created successfully.", null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


}
