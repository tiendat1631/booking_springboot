package com.dkpm.bus_booking_api.application.handler;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.dkpm.bus_booking_api.application.response.ApiResponse;
import com.dkpm.bus_booking_api.application.response.FieldError;
import com.dkpm.bus_booking_api.domain.exception.BusinessException;
import com.dkpm.bus_booking_api.domain.exception.ErrorCode;

import jakarta.validation.ConstraintViolationException;

/**
 * Global exception handler for the application.
 * Catches all exceptions and returns standardized API responses with error
 * codes.
 * 
 * Order of handlers:
 * 1. BusinessException - Custom business logic errors
 * 2. Validation exceptions - @Valid and @Validated errors
 * 3. Security exceptions - Authentication and authorization errors
 * 4. Legacy exceptions - IllegalArgumentException, IllegalStateException
 * 5. Generic Exception - Catch-all handler
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

        private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        // ==================== Business Exceptions ====================

        /**
         * Handle custom business exceptions.
         */
        @ExceptionHandler(BusinessException.class)
        public ResponseEntity<ApiResponse<Void>> handleBusinessException(
                        BusinessException ex, WebRequest request) {

                log.warn("Business exception: {} - {}", ex.getErrorCode(), ex.getMessage());

                ApiResponse<Void> response = ApiResponse.error(
                                ex.getErrorCode(),
                                ex.getMessage(),
                                getPath(request));

                return new ResponseEntity<>(response, ex.getErrorCode().getHttpStatus());
        }

        // ==================== Validation Exceptions ====================

        /**
         * Handle @Valid annotation validation errors.
         */
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiResponse<Void>> handleValidationException(
                        MethodArgumentNotValidException ex, WebRequest request) {

                List<FieldError> fieldErrors = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .map(error -> new FieldError(
                                                error.getField(),
                                                error.getDefaultMessage(),
                                                error.getRejectedValue()))
                                .toList();

                log.warn("Validation failed: {} errors", fieldErrors.size());

                ApiResponse<Void> response = ApiResponse.validationError(
                                "Validation failed",
                                fieldErrors,
                                getPath(request));

                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        /**
         * Handle @Validated constraint violations.
         */
        @ExceptionHandler(ConstraintViolationException.class)
        public ResponseEntity<ApiResponse<Void>> handleConstraintViolation(
                        ConstraintViolationException ex, WebRequest request) {

                List<FieldError> fieldErrors = ex.getConstraintViolations()
                                .stream()
                                .map(violation -> new FieldError(
                                                violation.getPropertyPath().toString(),
                                                violation.getMessage(),
                                                violation.getInvalidValue()))
                                .toList();

                log.warn("Constraint violation: {} errors", fieldErrors.size());

                ApiResponse<Void> response = ApiResponse.validationError(
                                "Validation failed",
                                fieldErrors,
                                getPath(request));

                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        /**
         * Handle missing required request parameters.
         */
        @ExceptionHandler(MissingServletRequestParameterException.class)
        public ResponseEntity<ApiResponse<Void>> handleMissingServletRequestParameter(
                        MissingServletRequestParameterException ex, WebRequest request) {

                log.warn("Missing required parameter: {}", ex.getParameterName());

                String message = String.format("Required parameter '%s' of type %s is missing",
                                ex.getParameterName(), ex.getParameterType());

                ApiResponse<Void> response = ApiResponse.error(
                                ErrorCode.INVALID_REQUEST,
                                message,
                                getPath(request));

                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        /**
         * Handle type mismatch for request parameters.
         */
        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<ApiResponse<Void>> handleMethodArgumentTypeMismatch(
                        MethodArgumentTypeMismatchException ex, WebRequest request) {

                log.warn("Type mismatch for parameter: {}", ex.getName());

                String requiredType = ex.getRequiredType() != null
                                ? ex.getRequiredType().getSimpleName()
                                : "unknown";
                String message = String.format("Parameter '%s' must be of type %s",
                                ex.getName(), requiredType);

                ApiResponse<Void> response = ApiResponse.error(
                                ErrorCode.INVALID_REQUEST,
                                message,
                                getPath(request));

                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // ==================== Security Exceptions ====================

        /**
         * Handle authentication fails.
         */
        @ExceptionHandler(AuthenticationException.class)
        public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(
                        AuthenticationException ex, WebRequest request) {

                log.warn("Authentication failed: {}", ex.getMessage());

                ApiResponse<Void> response = ApiResponse.error(
                                ErrorCode.UNAUTHORIZED,
                                "Authentication required",
                                getPath(request));

                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        /**
         * Handle authorization fails.
         */
        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(
                        AccessDeniedException ex, WebRequest request) {

                log.warn("Access denied: {}", ex.getMessage());

                ApiResponse<Void> response = ApiResponse.error(
                                ErrorCode.ACCESS_DENIED,
                                "Access denied",
                                getPath(request));

                return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
        }

        // ==================== Legacy Exception Handlers ====================

        /**
         * Handle IllegalArgumentException.
         */
        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(
                        IllegalArgumentException ex, WebRequest request) {

                log.warn("Illegal argument: {}", ex.getMessage());

                ApiResponse<Void> response = ApiResponse.error(
                                ErrorCode.INVALID_REQUEST,
                                ex.getMessage(),
                                getPath(request));

                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        /**
         * Handle IllegalStateException.
         */
        @ExceptionHandler(IllegalStateException.class)
        public ResponseEntity<ApiResponse<Void>> handleIllegalStateException(
                        IllegalStateException ex, WebRequest request) {

                log.warn("Illegal state: {}", ex.getMessage());

                ApiResponse<Void> response = ApiResponse.error(
                                ErrorCode.INVALID_REQUEST,
                                ex.getMessage(),
                                getPath(request));

                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // ==================== Generic Exception Handler ====================

        /**
         * Catch-all handler for unexpected exceptions.
         */
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiResponse<Void>> handleGenericException(
                        Exception ex, WebRequest request) {

                log.error("Unexpected error occurred", ex);

                ApiResponse<Void> response = ApiResponse.error(
                                ErrorCode.INTERNAL_ERROR,
                                "An unexpected error occurred. Please try again later.",
                                getPath(request));

                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // ==================== Helper Methods ====================

        /**
         * Extract request path from WebRequest.
         */
        private String getPath(WebRequest request) {
                String description = request.getDescription(false);
                return description.replace("uri=", "");
        }
}
