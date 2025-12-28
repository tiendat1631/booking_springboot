package com.dkpm.bus_booking_api.infrastructure.geocoding;

import com.dkpm.bus_booking_api.infrastructure.geocoding.dto.GeoCoordinates;

public interface IGeocodingService {
    GeoCoordinates getCoordinates(String fullAddress);
}
