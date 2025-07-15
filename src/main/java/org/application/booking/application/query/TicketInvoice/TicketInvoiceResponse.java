package org.application.booking.application.query.TicketInvoice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.application.booking.domain.aggregates.BusModel.Bus;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class TicketInvoiceResponse {
    private String name;
    private String phoneNum;
    private String bookingCode;
    private String trip;
    private String time;

    private List<String> seats;
    private float total;
}
