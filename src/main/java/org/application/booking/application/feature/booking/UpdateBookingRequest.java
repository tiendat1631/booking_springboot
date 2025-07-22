package org.application.booking.application.feature.booking;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class UpdateBookingRequest {
    private UUID tripId;
    private float total;
    // Nếu muốn cho phép sửa người đặt thì thêm:
    // private UUID userId;
}
