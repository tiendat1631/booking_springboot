package org.application.booking.application.query;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.application.booking.domain.aggregates.TripModel.Ticket;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.springframework.data.jpa.domain.Specification;


public class TripSpecification {
    public static Specification<Trip> hasTicket(int numberOfTickets) {
        return (root, query, builder) -> {
            // Tham gia bảng ticket
            Join<Trip, Ticket> join = root.join("tickets", JoinType.LEFT);

            // Chỉ lấy ticket chưa đặt
            Predicate ticketAvailable = builder.isFalse(join.get("isOccupied"));

            // Group theo trip.id
            query.groupBy(root.get("id"));

            // Lọc điều kiện sau khi group: chỉ lấy trip có số lượng ticket chưa đặt >= numberOfTickets
            query.having(builder.greaterThanOrEqualTo(
                    builder.count(join.get("id")), (long) numberOfTickets));

            // Áp dụng điều kiện where cho ticket
            query.where(ticketAvailable);

            // Trả về true vì điều kiện chính nằm trong having
            return builder.conjunction();
        };
    }


    public static Specification<Trip> fromLocation(String from) {
        return (root, query, builder) ->
            builder.equal(root.get("departure"),from);
    }

    public static Specification<Trip> toLocation(String to) {
        return (root, query, builder) ->
                builder.equal(root.get("destination"),to);
    }
    public static Specification<Trip> hasDate(String date){
        return (root, query, builder)->
                builder.equal(root.get("timeFrame"),date);
    }
}



