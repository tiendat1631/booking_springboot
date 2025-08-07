package org.application.booking.application.feature.trip.exception;

public class SameProvinceRouteException extends RuntimeException {
    private static final String DEFAULT_MESSAGE = "Departure and destination provinces must be different.";
    public SameProvinceRouteException(){
        super(DEFAULT_MESSAGE);
    }
    public SameProvinceRouteException(String message) {
        super(message);
    }
}
