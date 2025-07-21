package org.application.booking.application.feature.booking;

import lombok.RequiredArgsConstructor;
import org.application.booking.domain.aggregates.BookingModel.Booking;
import org.application.booking.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateBookingUseCase {

    private final BookingRepository bookingRepository;

    public void updateBooking(UUID id, UpdateBookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy booking với ID: " + id));

        if (request.getTripId() != null) {
            booking.setTripId(request.getTripId());
        }

        booking.setTotal(request.getTotal());

        bookingRepository.save(booking);
    }
}
