package org.application.booking.security.exception;

public class EmailAlreadyExistException extends RuntimeException {
    private static final String DEFAULT_MESSAGE = "Email already exists";

    public EmailAlreadyExistException() {
    super(DEFAULT_MESSAGE);
  }
    public EmailAlreadyExistException(String message) {
        super(message);
    }
}
