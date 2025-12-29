package com.dkpm.bus_booking_api.features.booking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.dkpm.bus_booking_api.domain.booking.Booking;
import com.dkpm.bus_booking_api.domain.booking.BookingStatus;

public record BookingResponse(
                UUID bookingId,
                String bookingCode,
                BookingStatus status,
                TripInfo trip,
                PassengerInfo passenger,
                List<SeatInfo> seats,
                BigDecimal totalAmount,
                BigDecimal discountAmount,
                BigDecimal finalAmount,
                LocalDateTime bookingTime,
                LocalDateTime expiryTime,
                PaymentInfo payment,
                String notes) {

        public record TripInfo(
                        UUID tripId,
                        String routeName,
                        String departureStation,
                        String arrivalStation,
                        LocalDateTime departureTime,
                        LocalDateTime arrivalTime,
                        String busLicensePlate,
                        String busType) {
        }

        public record PassengerInfo(
                        String name,
                        String phone,
                        String email) {
        }

        public record SeatInfo(
                        String seatId,
                        BigDecimal price) {
        }

        public record PaymentInfo(
                        UUID paymentId,
                        String method,
                        String status,
                        BigDecimal amount,
                        LocalDateTime paidAt) {
        }

        public static BookingResponse from(Booking booking) {
                TripInfo tripInfo = new TripInfo(
                                booking.getTrip().getId(),
                                booking.getTrip().getRoute().getName(),
                                booking.getTrip().getRoute().getDepartureStation().getName(),
                                booking.getTrip().getRoute().getArrivalStation().getName(),
                                booking.getTrip().getDepartureTime(),
                                booking.getTrip().getArrivalTime(),
                                booking.getTrip().getBus().getLicensePlate(),
                                booking.getTrip().getBus().getType().name());

                PassengerInfo passengerInfo = new PassengerInfo(
                                booking.getPassengerName(),
                                booking.getPassengerPhone(),
                                booking.getPassengerEmail());

                List<SeatInfo> seats = booking.getDetails().stream()
                                .map(detail -> new SeatInfo(detail.getSeatId(), detail.getSeatPrice()))
                                .toList();

                PaymentInfo paymentInfo = null;
                if (booking.getPayment() != null) {
                        paymentInfo = new PaymentInfo(
                                        booking.getPayment().getId(),
                                        booking.getPayment().getMethod().name(),
                                        booking.getPayment().getStatus().name(),
                                        booking.getPayment().getAmount(),
                                        booking.getPayment().getPaidAt());
                }

                return new BookingResponse(
                                booking.getId(),
                                booking.getBookingCode(),
                                booking.getStatus(),
                                tripInfo,
                                passengerInfo,
                                seats,
                                booking.getTotalAmount(),
                                booking.getDiscountAmount(),
                                booking.getFinalAmount(),
                                booking.getBookingTime(),
                                booking.getExpiryTime(),
                                paymentInfo,
                                booking.getNotes());
        }
}
