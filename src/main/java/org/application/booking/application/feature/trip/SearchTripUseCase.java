package org.application.booking.application.feature.trip;

import org.application.booking.presentation.DTO.SearchTripRequest;
import org.application.booking.presentation.DTO.TripInfoResponse;

import java.util.List;

public interface SearchTripUseCase {
    List<TripInfoResponse> searchTrip(SearchTripRequest searchTripRequest);
}
