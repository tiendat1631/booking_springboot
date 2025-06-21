//package org.application.booking.application.feature;
//
//import org.application.booking.domain.entity.Booking;
//import org.application.booking.domain.entity.BusBoundary.Seat;
//import org.application.booking.domain.entity.Trip.Trip;
//import org.application.booking.domain.entity.UserModel.User;
//import org.application.booking.repository.BookingRepository;
//import org.application.booking.repository.TripRepository;
//import org.application.booking.repository.UserRepository;
//import lombok.AllArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.application.booking.application.feature.booking.BookingRequest;
//import org.application.booking.presentation.DTO.BookingResponse;
//
//import java.util.List;
//
//
//@Service
//@AllArgsConstructor
//public class BookingUseCase {
//    private final TripRepository tripRepository;
//    private final UserRepository userRepository;
//    private final BookingRepository bookingRepository;
//    //private final SeatRepository seatRepository;
//
//    public BookingResponse excute (BookingRequest request) {
//        // Lay trip va user
//        Trip trip = tripRepository.findById(request.getTripId())
//                .orElseThrow(()-> new RuntimeException("Trip not found"));// unwrap
//        User user = userRepository.findById(request.getUserId())
//                .orElseThrow(()-> new RuntimeException("User not found"));
//        // lay dsach Seat tu Trip dua tren TripId
//        //List<Seat> selectedSeats = seatRepository.findAllByIdIn(request.getSeatIds());
//
//        // check valid seat
//        for (Seat seat : selectedSeats) {
//            if (seat.isOccupied()){
//                throw new RuntimeException("Seat already occupied");
//            }
//            if (!trip.getSeats().contains(seat)){
//                throw new RuntimeException("Seat does not belong to this trip's bus");
//            }
//        }
//        // 4. Gọi method trong Trip để tạo Booking (domain behavior)
//        Booking booking = trip.createBooking(selectedSeats, user);
//
//        // 5. Lưu xuống DB
//        Booking saved = bookingRepository.save(booking);
//
//        // 6. Trả về BookingResponse
//        return new BookingResponse(
//                saved.getId(),
//                saved.getTotalPrice(),
//                saved.getTimeCreate(),
//                saved.getSeats(),
//                saved.getTrip(),
//                saved.getUser()
//        );
//    }
//
//
//}
