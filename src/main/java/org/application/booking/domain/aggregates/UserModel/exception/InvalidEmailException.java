package org.application.booking.domain.aggregates.UserModel.exception;

public class InvalidEmailException extends RuntimeException {
    private static final String DEFAULT_MESSAGE = "Invalid email.";
    public InvalidEmailException() {
        super(DEFAULT_MESSAGE);
    }
    public InvalidEmailException(String message) {
        super(message);
    }
}
