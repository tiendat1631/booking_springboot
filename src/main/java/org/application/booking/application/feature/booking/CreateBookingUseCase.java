package org.application.booking.application.feature.booking;

import lombok.AllArgsConstructor;
import org.application.booking.domain.aggregates.BookingModel.Booking;
import org.application.booking.domain.aggregates.TripModel.Ticket;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.domain.aggregates.UserModel.User;
import org.application.booking.repository.BookingRepository;
import org.application.booking.repository.TripRepository;
import org.application.booking.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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
