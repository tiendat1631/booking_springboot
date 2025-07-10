package org.application.booking.presentation.DTO;

import lombok.Getter;
import lombok.Setter;
import org.application.booking.application.query.TripSpecification;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.springframework.data.jpa.domain.Specification;

@Getter
@Setter
public class SearchTripRequest {
    private String from;
    private String to;
    private String date;
    private int numberOfSeats;

    public Specification<Trip> toSpecification() {
        Specification<Trip> spec = Specification.where(null);

        from = Converter(from); //for testing only
        if (from != null && !from.isBlank()) {
            spec = spec.and(TripSpecification.fromLocation(from));
        }

        to = Converter(to);
        if (to != null && !to.isBlank()) {
            spec = spec.and(TripSpecification.toLocation(to));
        }
        if (date != null && !date.isBlank()) {
            spec = spec.and(TripSpecification.hasDate(date));
        }
        if (numberOfSeats >0){
            spec = spec.and(TripSpecification.hasTicket(numberOfSeats));
        }
        return spec;
    }

    private String Converter(String id) {
        switch (id) {
            case "29":
                return "Ha Noi";
            case "59":
                return "HCM";
            case "49":
                return "Lam Dong";
            case "43":
                return "Da Nang";
            case "36":
                return "Thanh Hoa";
            default:
                return "";
        }
    }

}
