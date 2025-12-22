package org.application.booking.exception;

public class EmailAlreadyExistException extends RuntimeException {
    private static final String DEFAULT_MESSAGE = "Email đã tồn tại";

    public EmailAlreadyExistException() {
        super(DEFAULT_MESSAGE);
    }

    public EmailAlreadyExistException(String message) {
        super(message);
    }
}
