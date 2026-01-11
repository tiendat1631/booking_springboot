package com.dkpm.bus_booking_api.domain.exception;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // ==================== Resource Errors (4xx) ====================

    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "Resource not found"),

    // ==================== Validation Errors (400) ====================

    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "Invalid request"),
    VALIDATION_FAILED(HttpStatus.BAD_REQUEST, "Validation failed"),

    // ==================== Conflict Errors (409) ====================

    DUPLICATE_RESOURCE(HttpStatus.CONFLICT, "Resource already exists"),
    SEAT_NOT_AVAILABLE(HttpStatus.CONFLICT, "Seat is not available"),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "Email already exists"),
    STATION_CODE_EXISTS(HttpStatus.CONFLICT, "Station code already exists"),
    ROUTE_CODE_EXISTS(HttpStatus.CONFLICT, "Route code already exists"),

    // ==================== Business Logic Errors (400) ====================

    TRIP_NOT_AVAILABLE(HttpStatus.BAD_REQUEST, "Trip is not available for booking"),
    TRIP_ALREADY_DEPARTED(HttpStatus.BAD_REQUEST, "Trip has already departed"),
    TRIP_INVALID_TIME(HttpStatus.BAD_REQUEST, "Arrival time must be after departure time"),
    TRIP_BUS_CONFLICT(HttpStatus.CONFLICT, "Bus has a scheduling conflict"),
    TRIP_NO_SEAT_LAYOUT(HttpStatus.BAD_REQUEST, "Bus does not have a seat layout configured"),
    TRIP_INVALID_STATUS(HttpStatus.BAD_REQUEST, "Invalid trip status for this operation"),

    BOOKING_EXPIRED(HttpStatus.BAD_REQUEST, "Booking has expired"),
    BOOKING_CANNOT_CANCEL(HttpStatus.BAD_REQUEST, "Booking cannot be cancelled"),
    BOOKING_INVALID_STATUS(HttpStatus.BAD_REQUEST, "Invalid booking status for this operation"),

    PAYMENT_ALREADY_COMPLETED(HttpStatus.BAD_REQUEST, "Payment already completed"),
    PAYMENT_FAILED(HttpStatus.BAD_REQUEST, "Payment processing failed"),

    VERIFICATION_TOKEN_EXPIRED(HttpStatus.BAD_REQUEST, "Verification token has expired"),

    // ==================== Authorization Errors (401/403) ====================

    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Authentication required"),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "Access denied"),
    NOT_AUTHORIZED_FOR_RESOURCE(HttpStatus.FORBIDDEN, "Not authorized to access this resource"),

    // ==================== Server Errors (5xx) ====================

    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred"),
    EMAIL_SEND_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to send email");

    private final HttpStatus httpStatus;
    private final String message;
}
