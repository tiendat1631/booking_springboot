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
    seatIds: string[];
    passengerName: string;
    passengerPhone: string;
    passengerEmail: string;
    notes?: string;
}

export interface CreateBookingResponse {
    bookingId: string;
    bookingCode: string;
    status: BookingStatus;
    totalAmount: number;
    expiryTime: string;
}

// Matches BookingResponse DTO from backend
export interface BookingResponse {
    bookingId: string;
    bookingCode: string;
    status: BookingStatus;
    trip: BookingTripInfo;
    passenger: BookingPassengerInfo;
    seats: BookingSeatInfo[];
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    bookingTime: string;
    expiryTime: string;
    payment: BookingPaymentInfo | null;
    notes: string | null;
}

export interface BookingTripInfo {
    tripId: string;
    routeName: string;
    departureStation: string;
    arrivalStation: string;
    departureTime: string;
    arrivalTime: string;
    busLicensePlate: string;
    busType: string;
}

export interface BookingPassengerInfo {
    name: string;
    phone: string;
    email: string;
}

export interface BookingSeatInfo {
    seatId: string;
    price: number;
}

export interface BookingPaymentInfo {
    paymentId: string;
    method: string;
    status: string;
    amount: number;
    paidAt: string | null;
}

export interface CancelBookingRequest {
    bookingId: string;
    otp: string;
}
