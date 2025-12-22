package org.application.booking.service.trip;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.application.booking.domain.aggregates.TripModel.Ticket;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class TripSpecification {
    public static Specification<Trip> hasTicket(int numberOfTickets) {
        return (root, query, builder) -> {
            Join<Trip, Ticket> join = root.join("tickets", JoinType.LEFT);

            // Chỉ lấy ticket chưa đặt
            Predicate ticketAvailable = builder.isFalse(join.get("isOccupied"));

            // Group theo trip.id
            assert query != null;
            query.groupBy(root.get("id"));

            // Lọc điều kiện sau khi group: chỉ lấy trip có số lượng ticket chưa đặt >= numberOfTickets
            query.having(builder.greaterThanOrEqualTo(
                    builder.count(join.get("id")), (long) numberOfTickets));

            return ticketAvailable;
        };
    }

    public static Specification<Trip> fromLocation(int departureCode) {
        return (root, query, builder) ->
                builder.equal(root.get("route").get("departure").get("code"), departureCode);
    }

    public static Specification<Trip> toLocation(int destinationCode) {
        return (root, query, builder) ->
                builder.equal(root.get("route").get("destination").get("code"), destinationCode);
    }

    public static Specification<Trip> hasDate(LocalDate date) {
        return (root, query, builder) -> builder.equal(
                builder.function("DATE", LocalDate.class, root.get("departureTime")),
                date
        );
    }
}



