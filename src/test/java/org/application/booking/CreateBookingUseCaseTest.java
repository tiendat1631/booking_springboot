package org.application.booking;

import org.application.booking.application.feature.booking.CreateBookingRequest;
import org.application.booking.application.feature.booking.BookingService;
import org.application.booking.domain.aggregates.BookingModel.Booking;
import org.application.booking.domain.aggregates.BusModel.Seat;
import org.application.booking.domain.aggregates.TripModel.Ticket;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.domain.aggregates.UserModel.User;
import org.application.booking.repository.BookingRepository;
import org.application.booking.repository.TripRepository;
import org.application.booking.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class    CreateBookingUseCaseTest {

    @Mock
    BookingRepository bookingRepository;
    @Mock
    TripRepository tripRepository;
    @Mock
    UserRepository userRepository;

    @InjectMocks
    BookingService useCase;
    UUID seatId1 = UUID.randomUUID();
    UUID seatId2 = UUID.randomUUID();
    UUID tripId = UUID.randomUUID();
    UUID userId = UUID.randomUUID();

    User user = new User();
//    Trip trip = new Trip();
    Seat seat1 = new Seat();
    Seat seat2 = new Seat();
    Ticket ticket1 = new Ticket();
    Ticket ticket2 = new Ticket();

    // create 2 tickets corresponding to 2 seats
    void setupTripWitSeats(){
        seat1.setId(seatId1);
        seat2.setId(seatId2);
        ticket1.setSeat(seat1);
        ticket2.setSeat(seat2);
        //trip.setTickets(List.of(ticket1, ticket2));
    }

//    @Test
//    void book_success_singleSeat (){
//        setupTripWitSeats();
//
//        CreateBookingRequest request = new CreateBookingRequest(tripId,List.of(seatId1),userId);
//        when(tripRepository.findById(tripId)).thenReturn(Optional.of(trip));
//        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
//
//        useCase.book(request);
//
//        verify(bookingRepository).save(any(Booking.class));
//    }

    @Test
    void book_success_manySeats (){}
}
