package org.application.booking.presentation.middleware;

import jakarta.persistence.EntityNotFoundException;
import org.application.booking.application.common.exception.NotFoundException;
import org.application.booking.application.feature.trip.exception.BusScheduleConflictException;
import org.application.booking.application.feature.trip.exception.SameProvinceRouteException;
import org.application.booking.presentation.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        logger.warn("Validation failed: {}", errors);

        ApiResponse<Map<String, String>> response = new ApiResponse<>(false, "Validation failed", errors);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Object>> handleResponseStatusException(ResponseStatusException ex) {
        logger.warn("ResponseStatusException: {}", ex.getMessage());

        ApiResponse<Object> response = ApiResponse.failure(ex.getReason());
        return new ResponseEntity<>(response, ex.getStatusCode());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneralException(Exception ex) {
        logger.error("Unhandled exception: ", ex);

        ApiResponse<Object> response = ApiResponse.failure("Internal Server Error");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFoundException(NotFoundException ex){
        logger.error("Entity not found: ", ex);

        ApiResponse<Object> response = ApiResponse.failure(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BusScheduleConflictException.class)
    public ResponseEntity<ApiResponse<Object>> handleBusScheduleConflictException(BusScheduleConflictException ex) {
        logger.warn("Bus schedule conflict: {}", ex.getMessage());

        ApiResponse<Object> response = ApiResponse.failure(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(SameProvinceRouteException.class)
    public ResponseEntity<ApiResponse<Object>> handleSameProvinceRouteException(SameProvinceRouteException ex) {
        logger.warn("Invalid route: {}", ex.getMessage());

        ApiResponse<Object> response = ApiResponse.failure(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }


}
