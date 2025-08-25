package org.application.booking.exception;

public class InvalidTokenException extends RuntimeException {
    private static final String DEFAULT_MESSAGE = "Invalid or expired token";

    public InvalidTokenException() {
        super(DEFAULT_MESSAGE);
    }

    public InvalidTokenException(String message) {
        super(message);
    }
}
