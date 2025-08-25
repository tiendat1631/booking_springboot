package org.application.booking.exception;

import org.application.booking.presentation.ApiResponse;
import org.application.booking.security.exception.EmailAlreadyExistException;
import org.application.booking.security.exception.UsernameAlreadyExistException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AuthExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(AuthExceptionHandler.class);

    @ExceptionHandler(EmailAlreadyExistException.class)
    public ResponseEntity<ApiResponse<Object>> handleEmailAlreadyExistException(EmailAlreadyExistException ex) {
        logger.error(ex.getMessage());

        ApiResponse<Object> response = ApiResponse.failure(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UsernameAlreadyExistException.class)
    public ResponseEntity<ApiResponse<Object>> handleUsernameAlreadyExistException(UsernameAlreadyExistException ex) {
        logger.error(ex.getMessage());

        ApiResponse<Object> response = ApiResponse.failure(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }
}
