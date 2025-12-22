package org.application.booking.exception;

public class BusScheduleConflictException extends RuntimeException {
    private static final String DEFAULT_MESSAGE = "Bus is already scheduled for another trip during this time.";

    public BusScheduleConflictException() {
        super(DEFAULT_MESSAGE);
    }

    public BusScheduleConflictException(String message) {
        super(message);
    }
}
