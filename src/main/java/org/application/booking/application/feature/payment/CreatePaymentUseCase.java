package org.application.booking.application.feature.payment;

import lombok.AllArgsConstructor;

import org.application.booking.domain.entity.Booking.Booking;
import org.application.booking.domain.entity.Payment;
import org.application.booking.domain.entity.User;
import org.application.booking.presentation.DTO.PaymentResponse;
import org.application.booking.repository.BookingRepository;
import org.application.booking.repository.PaymentRepository;
import org.application.booking.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor

public class CreatePaymentUseCase {
    public final PaymentRepository paymentRepository;
    public final BookingRepository bookingRepository;
    public final UserRepository userRepository;

    public PaymentResponse makePayment(PaymentRequest paymentRequest) {
        Booking booking = bookingRepository.findById(paymentRequest.getBookingId())
                .orElseThrow(()-> new RuntimeException("Booking not found"));
        User user = userRepository.findById(paymentRequest.getUserId())
                .orElseThrow(()-> new RuntimeException("User not found"));

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setUser(user);
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        payment.setPaymentStatus(payment.getPaymentStatus().APPROVED); // set tam

        payment = paymentRepository.save(payment);

        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .bookingId(booking.getId())
                .userId(user.getId())
                .amount(booking.getTotal())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .build();
    }
}
