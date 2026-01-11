// package com.dkpm.bus_booking_api.features.payment;

// import static org.assertj.core.api.Assertions.assertThat;
// import static org.assertj.core.api.Assertions.assertThatThrownBy;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.verify;
// import static org.mockito.Mockito.when;

// import java.time.LocalDateTime;
// import java.util.Optional;
// import java.util.UUID;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;

// import com.dkpm.bus_booking_api.domain.booking.Booking;
// import com.dkpm.bus_booking_api.domain.booking.BookingRepository;
// import com.dkpm.bus_booking_api.domain.booking.BookingStatus;
// import com.dkpm.bus_booking_api.domain.payment.Payment;
// import com.dkpm.bus_booking_api.domain.payment.PaymentMethod;
// import com.dkpm.bus_booking_api.domain.payment.PaymentRepository;
// import com.dkpm.bus_booking_api.domain.payment.PaymentStatus;
// import com.dkpm.bus_booking_api.domain.trip.Trip;
// import com.dkpm.bus_booking_api.features.booking.IBookingService;
// import com.dkpm.bus_booking_api.features.payment.dto.InitiatePaymentRequest;
// import com.dkpm.bus_booking_api.features.payment.dto.PaymentResponse;
// import com.dkpm.bus_booking_api.infrastructure.email.IEmailService;
// import com.dkpm.bus_booking_api.infrastructure.payment.VNPayClient;
// import com.dkpm.bus_booking_api.test.TestDataFactory;

// @ExtendWith(MockitoExtension.class)
// @DisplayName("PaymentService Unit Tests")
// class PaymentServiceTest {

// @Mock
// private PaymentRepository paymentRepository;

// @Mock
// private BookingRepository bookingRepository;

// @Mock
// private IBookingService bookingService;

// @Mock
// private VNPayClient vnPayClient;

// @Mock
// private IEmailService emailService;

// @InjectMocks
// private PaymentService paymentService;

// private Trip testTrip;
// private Booking testBooking;
// private Payment testPayment;

// @BeforeEach
// void setUp() {
// testTrip = TestDataFactory.createTrip();
// testBooking = TestDataFactory.createBooking(testTrip);
// testPayment = TestDataFactory.createPayment(testBooking);
// }

// @Test
// @DisplayName("initiatePayment - VNPay generates URL")
// void initiatePayment_vnpay_generatesUrl() {
// // Given
// InitiatePaymentRequest request = new InitiatePaymentRequest(
// PaymentMethod.VNPAY, "http://localhost/return", "127.0.0.1");

// when(bookingRepository.findByIdWithDetails(testBooking.getId())).thenReturn(Optional.of(testBooking));
// when(paymentRepository.findByBookingId(testBooking.getId())).thenReturn(Optional.empty());
// when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
// Payment saved = invocation.getArgument(0);
// saved.setId(UUID.randomUUID());
// return saved;
// });
// when(vnPayClient.createPaymentUrl(any(), any(), any(), any(), any()))
// .thenReturn("https://sandbox.vnpay.vn/payment?txn=123");

// // When
// PaymentResponse response =
// paymentService.initiatePayment(testBooking.getId(), request);

// // Then
// assertThat(response).isNotNull();
// assertThat(response.paymentUrl()).isNotNull();
// assertThat(response.paymentUrl()).contains("vnpay");
// }

// @Test
// @DisplayName("initiatePayment - expired booking throws exception")
// void initiatePayment_expired_throwsException() {
// // Given
// testBooking.setExpiryTime(LocalDateTime.now().minusMinutes(1));

// InitiatePaymentRequest request = new InitiatePaymentRequest(
// PaymentMethod.VNPAY, "http://localhost/return", "127.0.0.1");

// when(bookingRepository.findByIdWithDetails(testBooking.getId())).thenReturn(Optional.of(testBooking));

// // When/Then
// assertThatThrownBy(() -> paymentService.initiatePayment(testBooking.getId(),
// request))
// .isInstanceOf(IllegalStateException.class)
// .hasMessageContaining("expired");
// }

// @Test
// @DisplayName("initiatePayment - already confirmed throws exception")
// void initiatePayment_alreadyConfirmed_throwsException() {
// // Given
// testBooking.setStatus(BookingStatus.CONFIRMED);

// InitiatePaymentRequest request = new InitiatePaymentRequest(
// PaymentMethod.VNPAY, "http://localhost/return", "127.0.0.1");

// when(bookingRepository.findByIdWithDetails(testBooking.getId())).thenReturn(Optional.of(testBooking));

// // When/Then
// assertThatThrownBy(() -> paymentService.initiatePayment(testBooking.getId(),
// request))
// .isInstanceOf(IllegalStateException.class)
// .hasMessageContaining("not in PENDING");
// }

// @Test
// @DisplayName("processVnpayCallback - success confirms booking")
// void processVnpayCallback_success_confirmsBooking() {
// // Given
// String txnRef = "202412241234560001";
// testPayment.setVnpayTxnRef(txnRef);

// when(paymentRepository.findByVnpayTxnRef(txnRef)).thenReturn(Optional.of(testPayment));
// when(vnPayClient.isSuccessResponse("00")).thenReturn(true);
// when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);
// when(bookingRepository.findByIdWithDetails(any())).thenReturn(Optional.of(testBooking));

// // When
// boolean result = paymentService.processVnpayCallback(txnRef, "00",
// "VNP123456");

// // Then
// assertThat(result).isTrue();
// assertThat(testPayment.getStatus()).isEqualTo(PaymentStatus.COMPLETED);
// verify(bookingService).confirmBooking(testBooking.getId());
// verify(emailService).sendPaymentConfirmation(any(Booking.class));
// }

// @Test
// @DisplayName("processVnpayCallback - failed marks payment failed")
// void processVnpayCallback_failed_marksPaymentFailed() {
// // Given
// String txnRef = "202412241234560001";
// testPayment.setVnpayTxnRef(txnRef);

// when(paymentRepository.findByVnpayTxnRef(txnRef)).thenReturn(Optional.of(testPayment));
// when(vnPayClient.isSuccessResponse("99")).thenReturn(false);
// when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

// // When
// boolean result = paymentService.processVnpayCallback(txnRef, "99", null);

// // Then
// assertThat(result).isFalse();
// assertThat(testPayment.getStatus()).isEqualTo(PaymentStatus.FAILED);
// }

// @Test
// @DisplayName("confirmCashPayment - confirms booking")
// void confirmCashPayment_confirmsBooking() {
// // Given
// when(paymentRepository.findByBookingIdWithDetails(testBooking.getId())).thenReturn(Optional.empty());
// when(bookingRepository.findByIdWithDetails(testBooking.getId())).thenReturn(Optional.of(testBooking));
// when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
// Payment saved = invocation.getArgument(0);
// saved.setId(UUID.randomUUID());
// return saved;
// });

// // When
// PaymentResponse response =
// paymentService.confirmCashPayment(testBooking.getId(), "Paid at counter");

// // Then
// assertThat(response).isNotNull();
// assertThat(response.method()).isEqualTo(PaymentMethod.CASH);
// verify(bookingService).confirmBooking(testBooking.getId());
// verify(emailService).sendPaymentConfirmation(any(Booking.class));
// }

// @Test
// @DisplayName("getPaymentStatus - returns payment info")
// void getPaymentStatus_returnsPaymentInfo() {
// // Given
// when(paymentRepository.findByBookingIdWithDetails(testBooking.getId()))
// .thenReturn(Optional.of(testPayment));

// // When
// PaymentResponse response =
// paymentService.getPaymentStatus(testBooking.getId());

// // Then
// assertThat(response).isNotNull();
// assertThat(response.method()).isEqualTo(PaymentMethod.VNPAY);
// }
// }
