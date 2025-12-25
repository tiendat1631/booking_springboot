package com.dkpm.bus_booking_api.features.payment;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dkpm.bus_booking_api.application.response.ApiResponse;
import com.dkpm.bus_booking_api.features.payment.dto.InitiatePaymentRequest;
import com.dkpm.bus_booking_api.features.payment.dto.PaymentResponse;
import com.dkpm.bus_booking_api.infrastructure.payment.VNPayClient;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final IPaymentService paymentService;
    private final VNPayClient vnPayClient;

    /**
     * Initiate payment for a booking
     */
    @PostMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> initiatePayment(
            @PathVariable UUID bookingId,
            @Valid @RequestBody InitiatePaymentRequest request,
            HttpServletRequest httpRequest) {

        // Get client IP
        String ipAddress = getClientIp(httpRequest);

        InitiatePaymentRequest requestWithIp = new InitiatePaymentRequest(
                request.method(),
                request.returnUrl(),
                ipAddress);

        PaymentResponse payment = paymentService.initiatePayment(bookingId, requestWithIp);
        return ResponseEntity.ok(ApiResponse.success(payment, "Payment initiated successfully"));
    }

    /**
     * Get payment status for a booking
     */
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentStatus(@PathVariable UUID bookingId) {
        PaymentResponse payment = paymentService.getPaymentStatus(bookingId);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    /**
     * VNPay IPN callback (Instant Payment Notification)
     * NOTE: This endpoint returns raw Map format as required by VNPay,
     * not wrapped in ApiResponse.
     */
    @GetMapping("/vnpay/callback")
    public ResponseEntity<Map<String, String>> vnpayCallback(
            @RequestParam Map<String, String> params) {

        log.info("VNPay callback received: {}", params);

        Map<String, String> response = new HashMap<>();

        // Validate signature
        if (!vnPayClient.validateCallback(new HashMap<>(params))) {
            log.error("VNPay callback signature validation failed");
            response.put("RspCode", "97");
            response.put("Message", "Invalid signature");
            return ResponseEntity.ok(response);
        }

        String vnpTxnRef = params.get("vnp_TxnRef");
        String vnpResponseCode = params.get("vnp_ResponseCode");
        String vnpTransactionNo = params.get("vnp_TransactionNo");

        try {
            boolean success = paymentService.processVnpayCallback(vnpTxnRef, vnpResponseCode, vnpTransactionNo);

            if (success) {
                response.put("RspCode", "00");
                response.put("Message", "Confirm Success");
            } else {
                response.put("RspCode", "01");
                response.put("Message", "Order not found or already processed");
            }
        } catch (Exception e) {
            log.error("Error processing VNPay callback: {}", e.getMessage());
            response.put("RspCode", "99");
            response.put("Message", "Unknown error");
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Confirm cash payment (Admin only)
     */
    @PostMapping("/cash/confirm/{bookingId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaymentResponse>> confirmCashPayment(
            @PathVariable UUID bookingId,
            @RequestParam(required = false) String note) {

        PaymentResponse payment = paymentService.confirmCashPayment(bookingId, note);
        return ResponseEntity.ok(ApiResponse.success(payment, "Cash payment confirmed successfully"));
    }

    /**
     * Get client IP address
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
