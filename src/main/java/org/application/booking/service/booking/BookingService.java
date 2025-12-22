package org.application.booking.service.booking;

import lombok.AllArgsConstructor;
import org.application.booking.controller.dto.CreateBookingForUserRequest;
import org.application.booking.domain.aggregates.BookingModel.Booking;
import org.application.booking.domain.aggregates.TripModel.Ticket;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.domain.aggregates.UserModel.User;
import org.application.booking.exception.NotFoundException;
import org.application.booking.repository.BookingRepository;
import org.application.booking.repository.TripRepository;
import org.application.booking.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public void book(CreateBookingForUserRequest request) {
        Trip trip = tripRepository.findById(request.tripId())
                .orElseThrow(() -> new NotFoundException(Trip.class, request.tripId()));
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new NotFoundException(User.class, request.userId()));

        List<Ticket> tickets = trip.getTickets().stream()
                .filter(ticket -> request.seatIds().contains(ticket.getSeat().getId()))
                .toList();

        Booking booking = Booking.Create(user, trip, LocalDateTime.now(), tickets);
        bookingRepository.save(booking);
    }
}
