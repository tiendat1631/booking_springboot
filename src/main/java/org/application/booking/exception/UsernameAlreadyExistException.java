package org.application.booking.exception;

public class UsernameAlreadyExistException extends RuntimeException {
    private static final String DEFAULT_MESSAGE = "Username đã tồn tại";

    public UsernameAlreadyExistException() {
        super(DEFAULT_MESSAGE);
    }

    public UsernameAlreadyExistException(String message) {
        super(message);
    }
}
