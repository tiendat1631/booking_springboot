package org.application.booking.domain.aggregates.UserModel.exception;

public class InvalidUsernameException extends RuntimeException {
    private static final String DEFAULT_MESSAGE = "Invalid username.";
    public InvalidUsernameException() {
        super(DEFAULT_MESSAGE);
    }
    public InvalidUsernameException(String message) {
        super(message);
    }
}
