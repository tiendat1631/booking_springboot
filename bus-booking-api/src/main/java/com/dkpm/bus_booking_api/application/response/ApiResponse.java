package com.dkpm.bus_booking_api.application.response;

import java.time.LocalDateTime;
import java.util.List;

import com.dkpm.bus_booking_api.domain.exception.ErrorCode;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Standard API response wrapper for all endpoints.
 * Follows REST API best practices for Spring Boot 4.0.1.
 *
 * @param <T> The type of data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String code;
    private String message;
    private T data;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    private String path;
    private List<FieldError> errors;

    // ==================== Success Responses ====================

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> success(String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    // ==================== Error Responses ====================

    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String message, String path) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .path(path)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> error(ErrorCode errorCode, String message, String path) {
        return ApiResponse.<T>builder()
                .success(false)
                .code(errorCode.name())
                .message(message)
                .path(path)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String code, String message, String path) {
        return ApiResponse.<T>builder()
                .success(false)
                .code(code)
                .message(message)
                .path(path)
                .timestamp(LocalDateTime.now())
                .build();
    }

    // ==================== Validation Error Responses ====================

    public static <T> ApiResponse<T> validationError(String message, List<FieldError> errors) {
        return ApiResponse.<T>builder()
                .success(false)
                .code(ErrorCode.VALIDATION_FAILED.name())
                .message(message)
                .errors(errors)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> validationError(String message, List<FieldError> errors, String path) {
        return ApiResponse.<T>builder()
                .success(false)
                .code(ErrorCode.VALIDATION_FAILED.name())
                .message(message)
                .errors(errors)
                .path(path)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
