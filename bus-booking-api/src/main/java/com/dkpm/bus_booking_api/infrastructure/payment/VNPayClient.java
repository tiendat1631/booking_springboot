package com.dkpm.bus_booking_api.infrastructure.payment;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Component;

import com.dkpm.bus_booking_api.config.VnpayProperties;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * VNPay payment gateway client
 * Documentation: https://sandbox.vnpayment.vn/apis/
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class VNPayClient {

    private final VnpayProperties vnpayProperties;

    /**
     * Create VNPay payment URL
     *
     * @param txnRef          Unique transaction reference
     * @param amount          Amount in VND
     * @param orderInfo       Order description
     * @param ipAddress       Client IP address
     * @param customReturnUrl Optional custom return URL
     * @return VNPay payment URL
     */
    public String createPaymentUrl(String txnRef, BigDecimal amount, String orderInfo,
            String ipAddress, String customReturnUrl) {

        Map<String, String> vnpParams = new HashMap<>();

        vnpParams.put("vnp_Version", vnpayProperties.version());
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnpayProperties.tmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(amount.multiply(BigDecimal.valueOf(100)).longValue()));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", txnRef);
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", "billpayment");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", customReturnUrl != null ? customReturnUrl : vnpayProperties.returnUrl());
        vnpParams.put("vnp_IpAddr", ipAddress != null ? ipAddress : "127.0.0.1");

        // Create date
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_CreateDate", vnpCreateDate);

        // Expire date (15 minutes)
        cld.add(Calendar.MINUTE, 15);
        String vnpExpireDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        // Build query string
        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (String fieldName : fieldNames) {
            String fieldValue = vnpParams.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                // Build query string
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                if (fieldNames.indexOf(fieldName) < fieldNames.size() - 1) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }

        // Generate secure hash
        String vnpSecureHash = hmacSHA512(vnpayProperties.hashSecret(), hashData.toString());
        query.append("&vnp_SecureHash=").append(vnpSecureHash);

        String paymentUrl = vnpayProperties.url() + "?" + query;

        log.info("Created VNPay payment URL for txnRef: {}", txnRef);

        return paymentUrl;
    }

    /**
     * Validate VNPay callback signature
     */
    public boolean validateCallback(Map<String, String> vnpParams) {
        String vnpSecureHash = vnpParams.get("vnp_SecureHash");
        if (vnpSecureHash == null) {
            return false;
        }

        // Remove hash fields for validation
        vnpParams.remove("vnp_SecureHash");
        vnpParams.remove("vnp_SecureHashType");

        // Rebuild hash data
        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnpParams.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                if (fieldNames.indexOf(fieldName) < fieldNames.size() - 1) {
                    hashData.append('&');
                }
            }
        }

        String calculatedHash = hmacSHA512(vnpayProperties.hashSecret(), hashData.toString());

        return vnpSecureHash.equalsIgnoreCase(calculatedHash);
    }

    /**
     * HMAC-SHA512 hash
     */
    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder();
            for (byte b : result) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            log.error("Error generating HMAC-SHA512: {}", e.getMessage());
            throw new RuntimeException("Error generating hash", e);
        }
    }

    /**
     * Check if response code indicates success
     */
    public boolean isSuccessResponse(String responseCode) {
        return "00".equals(responseCode);
    }
}
