package org.application.booking.exception;

public class NotFoundException extends RuntimeException {
    public NotFoundException(Class<?> entityClass, Object id) {
        super(String.format("%s with ID [%s] not found", entityClass.getSimpleName(), id));
    }

    public NotFoundException(String message) {
        super(message);
    }
}
