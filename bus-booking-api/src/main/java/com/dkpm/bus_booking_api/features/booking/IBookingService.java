package com.dkpm.bus_booking_api.features.booking;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dkpm.bus_booking_api.domain.booking.BookingStatus;
import com.dkpm.bus_booking_api.features.booking.dto.BookingResponse;
import com.dkpm.bus_booking_api.features.booking.dto.CreateBookingRequest;

public interface IBookingService {

    /**
     * Create a new booking with seat reservation
     */
    BookingResponse createBooking(CreateBookingRequest request, UUID customerId);

    /**
     * Get booking by ID
     */
    BookingResponse getBookingById(UUID bookingId);

    /**
     * Get booking by booking code
     */
    BookingResponse getBookingByCode(String bookingCode);

    /**
     * Get customer's bookings
     */
    Page<BookingResponse> getCustomerBookings(UUID customerId, Pageable pageable);

    /**
     * Cancel a booking
     * 
     * @param bookingId the booking to cancel
     * @param callerId  the ID of the caller (admin or customer)
     *                  - Admin: can cancel any booking
     *                  - Customer: can only cancel their own booking
     */
    BookingResponse cancelBooking(UUID bookingId, UUID callerId);

    /**
     * Search bookings (admin)
     */
    Page<BookingResponse> searchBookings(BookingStatus status, String keyword, Pageable pageable);

    /**
     * Process expired bookings (scheduled task)
     */
    void processExpiredBookings();

    /**
     * Confirm booking after successful payment
     */
    BookingResponse confirmBooking(UUID bookingId);

    /**
     * Request booking cancellation (sends OTP to email)
     */
    void requestCancelBooking(String bookingCode, String passengerPhone);

    /**
     * Confirm booking cancellation with OTP
     */
    BookingResponse confirmCancelBooking(String bookingCode, String otpCode);

    void expireBooking(UUID bookingId);


}
