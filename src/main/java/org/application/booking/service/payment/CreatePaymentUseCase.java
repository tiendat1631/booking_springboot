package org.application.booking.service.payment;

import lombok.AllArgsConstructor;
import org.application.booking.controller.dto.PaymentRequest;
import org.application.booking.controller.dto.PaymentResponse;
import org.application.booking.domain.aggregates.BookingModel.Booking;
import org.application.booking.domain.aggregates.Payment;
import org.application.booking.domain.aggregates.UserModel.User;
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
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        User user = userRepository.findById(paymentRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setUser(user);
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        payment.setPaymentStatus(Payment.PaymentStatus.APPROVED); // set tam

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
