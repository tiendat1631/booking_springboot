package org.application.booking.application.query.TicketInvoice;

import lombok.RequiredArgsConstructor;
import org.application.booking.domain.aggregates.BookingModel.BookedTicket;
import org.application.booking.domain.aggregates.BookingModel.Booking;
import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.domain.aggregates.UserModel.User;
import org.application.booking.repository.BookingRepository;
import org.application.booking.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketQueryService {
    private final BookingRepository bookingRepository;


    public TicketInvoiceResponse findTicketInvoice(TicketInvoiceRequest request){
        Optional<Booking> bookingOpt = bookingRepository.findByBookingCodeAndUser_PhoneNum(request.getBookingCode(), request.getPhoneNum());
        if (bookingOpt.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy booking");
        }
        Booking booking = bookingOpt.get();

        User user = booking.getUser();
        Trip trip = booking.getTrip();

        List<String> seats = booking.getBookedTickets()
                .stream()
                .map(bt -> bt.getTicket().getSeat().getId().toString())
                .collect(Collectors.toList());

        return new TicketInvoiceResponse().builder()
                .name(user.getName())
                .phoneNum(user.getPhoneNum())
                .bookingCode(booking.getBookingCode())
                .trip("Hà Nội → Sài Gòn")
                .time(trip.getTimeFrame().getStart().toString())
                .seats(seats)
                .total(booking.getTotal())
                .build();

    }
}
