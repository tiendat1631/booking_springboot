package com.dkpm.bus_booking_api.infrastructure.email;

import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.dkpm.bus_booking_api.infrastructure.config.AppProperties;
import com.dkpm.bus_booking_api.domain.booking.Booking;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService implements IEmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username:noreply@busbooking.com}")
    private String fromEmail;

    private final AppProperties appProperties;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @Override
    @Async
    public void sendBookingConfirmation(Booking booking) {
        if (booking.getPassengerEmail() == null || booking.getPassengerEmail().isBlank()) {
            log.warn("No email address for booking {}, skipping email", booking.getBookingCode());
            return;
        }

        try {
            Context context = createBookingContext(booking);
            context.setVariable("emailType", "confirmation");

            String htmlContent = templateEngine.process("email/booking-confirmation", context);
            String subject = String.format("[%s] Xác nhận đặt vé - %s", appProperties.name(), booking.getBookingCode());

            sendEmail(booking.getPassengerEmail(), subject, htmlContent);
            log.info("Sent booking confirmation email for {}", booking.getBookingCode());
        } catch (Exception e) {
            log.error("Failed to send booking confirmation email for {}: {}",
                    booking.getBookingCode(), e.getMessage());
        }
    }

    @Override
    @Async
    public void sendBookingCancellation(Booking booking) {
        if (booking.getPassengerEmail() == null || booking.getPassengerEmail().isBlank()) {
            log.warn("No email address for booking {}, skipping cancellation email", booking.getBookingCode());
            return;
        }

        try {
            Context context = createBookingContext(booking);
            context.setVariable("emailType", "cancellation");

            String htmlContent = templateEngine.process("email/booking-cancellation", context);
            String subject = String.format("[%s] Hủy vé - %s", appProperties.name(), booking.getBookingCode());

            sendEmail(booking.getPassengerEmail(), subject, htmlContent);
            log.info("Sent booking cancellation email for {}", booking.getBookingCode());
        } catch (Exception e) {
            log.error("Failed to send booking cancellation email for {}", booking.getBookingCode());
        }
    }

    @Override
    @Async
    public void sendPaymentConfirmation(Booking booking) {
        if (booking.getPassengerEmail() == null || booking.getPassengerEmail().isBlank()) {
            log.warn("No email address for booking {}, skipping payment email", booking.getBookingCode());
            return;
        }

        try {
            Context context = createBookingContext(booking);
            context.setVariable("emailType", "payment");

            if (booking.getPayment() != null) {
                context.setVariable("paymentMethod", booking.getPayment().getMethod().name());
                context.setVariable("paymentAmount", formatCurrency(booking.getPayment().getAmount().longValue()));
                if (booking.getPayment().getPaidAt() != null) {
                    context.setVariable("paidAt", booking.getPayment().getPaidAt().format(DATETIME_FORMATTER));
                }
                context.setVariable("transactionId", booking.getPayment().getTransactionId());
            }

            String htmlContent = templateEngine.process("email/payment-confirmation", context);
            String subject = String.format("[%s] Thanh toán thành công - %s", appProperties.name(),
                    booking.getBookingCode());

            sendEmail(booking.getPassengerEmail(), subject, htmlContent);
            log.info("Sent payment confirmation email for {}", booking.getBookingCode());
        } catch (Exception e) {
            log.error("Failed to send payment confirmation email for {}: {}",
                    booking.getBookingCode(), e.getMessage());
        }
    }

    @Override
    public void sendVerificationEmail(String email, String token) {
        log.info("Sending verification email to {}", email);
        try {
            Context context = new Context();
            context.setVariable("email", email);
            context.setVariable("token", token);
            context.setVariable("appName", appProperties.name());
            // Use configured frontend URL for verification link
            context.setVariable("verificationUrl", appProperties.frontendUrl() + "/verify?token=" + token);

            String htmlContent = templateEngine.process("email/verification-email", context);
            sendEmail(email, "Xác thực tài khoản - " + appProperties.name(), htmlContent);
            log.info("Sent verification email to {}", email);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", email, e.getMessage());
        }
    }

    @Override
    @Async
    public void sendCancellationOtp(Booking booking, String otpCode) {
        if (booking.getPassengerEmail() == null || booking.getPassengerEmail().isBlank()) {
            log.warn("No email address for booking {}, skipping OTP email", booking.getBookingCode());
            return;
        }

        try {
            Context context = new Context();
            context.setVariable("bookingCode", booking.getBookingCode());
            context.setVariable("passengerName", booking.getPassengerName());
            context.setVariable("otpCode", otpCode);
            context.setVariable("appName", appProperties.name());
            context.setVariable("expiryMinutes", 10);

            String htmlContent = templateEngine.process("email/cancellation-otp", context);
            String subject = String.format("[%s] Mã xác nhận hủy vé - %s", appProperties.name(),
                    booking.getBookingCode());

            sendEmail(booking.getPassengerEmail(), subject, htmlContent);
            log.info("Sent cancellation OTP email for {}", booking.getBookingCode());
        } catch (Exception e) {
            log.error("Failed to send cancellation OTP email for {}: {}",
                    booking.getBookingCode(), e.getMessage());
        }
    }

    @Override
    public void sendEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.debug("Email sent to {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Override
    @Async
    public void sendTripCancellationNotification(Booking booking) {
        if (booking.getPassengerEmail() == null || booking.getPassengerEmail().isBlank()) {
            log.warn("No email address for booking {}, skipping trip cancellation notification",
                    booking.getBookingCode());
            return;
        }

        try {
            Context context = createBookingContext(booking);
            context.setVariable("emailType", "trip_cancellation");
            context.setVariable("cancellationReason", "Chuyến xe đã bị hủy bởi nhà xe");

            String htmlContent = templateEngine.process("email/trip-cancellation", context);
            String subject = String.format("[%s] Thông báo hủy chuyến - %s", appProperties.name(),
                    booking.getBookingCode());

            sendEmail(booking.getPassengerEmail(), subject, htmlContent);
            log.info("Sent trip cancellation notification for booking {}", booking.getBookingCode());
        } catch (Exception e) {
            log.error("Failed to send trip cancellation notification for {}: {}",
                    booking.getBookingCode(), e.getMessage());
        }
    }

    /**
     * Create Thymeleaf context with booking information
     */
    private Context createBookingContext(Booking booking) {
        Context context = new Context();

        // Booking info
        context.setVariable("bookingCode", booking.getBookingCode());
        context.setVariable("bookingStatus", booking.getStatus().name());
        context.setVariable("bookingTime", booking.getBookingTime().format(DATETIME_FORMATTER));

        // Passenger info
        context.setVariable("passengerName", booking.getPassengerName());
        context.setVariable("passengerPhone", booking.getPassengerPhone());
        context.setVariable("passengerEmail", booking.getPassengerEmail());

        // Trip info
        if (booking.getTrip() != null) {
            context.setVariable("routeName", booking.getTrip().getRoute().getName());
            context.setVariable("departureStation", booking.getTrip().getDepartureStation().getName());
            context.setVariable("arrivalStation", booking.getTrip().getDestinationStation().getName());
            context.setVariable("departureDate", booking.getTrip().getDepartureTime().format(DATE_FORMATTER));
            context.setVariable("departureTime", booking.getTrip().getDepartureTime().format(TIME_FORMATTER));
            context.setVariable("arrivalTime", booking.getTrip().getArrivalTime().format(TIME_FORMATTER));
            context.setVariable("busLicensePlate", booking.getTrip().getBus().getLicensePlate());
            context.setVariable("busType", booking.getTrip().getBus().getType().name());
        }

        // Seat info
        if (booking.getDetails() != null && !booking.getDetails().isEmpty()) {
            String seats = booking.getDetails().stream()
                    .map(d -> d.getSeatId())
                    .reduce((a, b) -> a + ", " + b)
                    .orElse("");
            context.setVariable("seats", seats);
            context.setVariable("seatCount", booking.getDetails().size());
        }

        // Pricing info
        context.setVariable("totalAmount", formatCurrency(booking.getTotalAmount().longValue()));
        context.setVariable("discountAmount", formatCurrency(booking.getDiscountAmount().longValue()));
        context.setVariable("finalAmount", formatCurrency(booking.getFinalAmount().longValue()));

        // App info
        context.setVariable("appName", appProperties.name());

        return context;
    }

    /**
     * Format currency in VND
     */
    private String formatCurrency(long amount) {
        return String.format("%,d VND", amount).replace(",", ".");
    }
}
