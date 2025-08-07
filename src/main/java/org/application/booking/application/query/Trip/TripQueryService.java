package org.application.booking.application.query.Trip;

import org.application.booking.domain.aggregates.TripModel.Trip;
import org.application.booking.presentation.DTO.SearchTripRequest;
import org.application.booking.presentation.DTO.TripInfoResponse;
import org.application.booking.repository.TripRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripQueryService {
    private final TripRepository tripRepository;

    public TripQueryService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

//    public List<TripInfoResponse> searchTrips(SearchTripRequest request) {
//        Specification<Trip> spec = request.toSpecification();
//        List<Trip> trips = tripRepository.findAll(spec);
//
//        return trips.stream()
//                .map(TripMapper::toTripInfoResponse) // hoặc toResponse nếu không cần buses
//                .collect(Collectors.toList());
//    }
}