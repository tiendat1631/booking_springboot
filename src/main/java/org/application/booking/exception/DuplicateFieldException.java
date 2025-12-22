package org.application.booking.exception;

public class DuplicateFieldException extends RuntimeException {
    public DuplicateFieldException(String fieldName, String fieldValue) {
        super(String.format("The field '%s' with value '%s' already exists.", fieldName, fieldValue));
    }
}
