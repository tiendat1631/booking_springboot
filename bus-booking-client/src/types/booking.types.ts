export type BookingStatus =
    | "PENDING"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED";

export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "FAILED";

export interface Booking {
    id: string;
    tripId: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    seatNumbers: string[];
    bookingStatus: BookingStatus;
    paymentStatus: PaymentStatus;
    totalPrice: number;
    bookedAt: string;
    updatedAt: string;
}

export interface BookingDetails extends Booking {
    trip: {
        id: string;
        departureStation: string;
        arrivalStation: string;
        departureTime: string;
        arrivalTime: string;
        busNumber: string;
    };
}

export interface CreateBookingRequest {
    tripId: string;
    seatNumbers: string[];
    customerName: string;
    customerEmail: string;
    customerPhone: string;
}

export interface CancelBookingRequest {
    bookingId: string;
    otp: string;
}
