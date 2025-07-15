package org.application.booking.application.query.TicketInvoice;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketInvoiceRequest {
    private String phoneNum;
    private String bookingCode;
}
