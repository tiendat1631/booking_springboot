package org.application.booking.application.feature.booking;

import lombok.AllArgsConstructor;
import org.application.booking.domain.entity.Booking.Booking;
import org.application.booking.domain.entity.Ticket;
import org.application.booking.domain.entity.Trip;
import org.application.booking.domain.entity.User;
import org.application.booking.repository.BookingRepository;
import org.application.booking.repository.TripRepository;
import org.application.booking.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CreateBookingUseCase {
    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public void book(CreateBookingRequest request){
        Trip trip = tripRepository.findById(request.tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));

        User user = userRepository.findById(request.userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Ticket> tickets = trip.getTickets().stream()
                .filter(ticket -> request.seatIds.contains(ticket.getSeat().getId()))
                .toList();

        Booking booking = Booking.Create(user, trip, LocalDateTime.now(), tickets);
        bookingRepository.save(booking);
    }
}
