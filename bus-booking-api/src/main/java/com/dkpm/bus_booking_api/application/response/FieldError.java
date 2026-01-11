package com.dkpm.bus_booking_api.application.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a field-level validation error.
 * Used in ApiResponse when validation fails.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldError {

    /**
     * The field name.
     */
    private String field;

    /**
     * The error message.
     */
    private String message;

    /**
     * The rejected value.
     */
    private Object rejectedValue;

    public FieldError(String field, String message) {
        this.field = field;
        this.message = message;
    }
}
