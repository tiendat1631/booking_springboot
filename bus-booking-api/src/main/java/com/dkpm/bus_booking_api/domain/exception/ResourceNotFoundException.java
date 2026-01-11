package com.dkpm.bus_booking_api.domain.exception;

/**
 * Exception thrown when a requested resource is not found.
 * Extends BusinessException with ErrorCode.RESOURCE_NOT_FOUND.
 */
public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException(String message) {
        super(ErrorCode.RESOURCE_NOT_FOUND, message);
    }

    /**
     * Create exception with resource type and identifier.
     * 
     * @param resourceType The type of resource (e.g., "Trip", "Booking")
     * @param id           The identifier of the resource
     */
    public ResourceNotFoundException(String resourceType, Object id) {
        super(ErrorCode.RESOURCE_NOT_FOUND,
                String.format("%s not found with id: %s", resourceType, id));
    }
}