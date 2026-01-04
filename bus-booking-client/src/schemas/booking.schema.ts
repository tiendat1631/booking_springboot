import * as z from "zod";

// Re-export from payment schema
export { paymentStatusEnum, type PaymentStatus } from "./payment.schema";

// Enums
export const bookingStatusEnum = z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]);

// Nested schemas
export const tripInfoSchema = z.object({
    tripId: z.uuid(),
    routeName: z.string(),
    departureStation: z.string(),
    arrivalStation: z.string(),
    departureTime: z.string(),
    arrivalTime: z.string(),
    busLicensePlate: z.string(),
    busType: z.string(),
});

export const passengerInfoSchema = z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string(),
});

export const seatInfoSchema = z.object({
    seatId: z.string(),
    price: z.number(),
});

export const paymentInfoSchema = z.object({
    paymentId: z.uuid(),
    method: z.string(),
    status: z.string(),
    amount: z.number(),
    paidAt: z.string().nullable(),
});

// Main booking schema
export const bookingSchema = z.object({
    bookingId: z.uuid(),
    bookingCode: z.string(),
    status: bookingStatusEnum,
    trip: tripInfoSchema,
    passenger: passengerInfoSchema,
    seats: z.array(seatInfoSchema),
    totalAmount: z.number(),
    discountAmount: z.number(),
    finalAmount: z.number(),
    bookingTime: z.string(),
    expiryTime: z.string().nullable(),
    payment: paymentInfoSchema.nullable(),
    notes: z.string().nullable(),
});

// Types
export type BookingStatus = z.infer<typeof bookingStatusEnum>;
export type TripInfo = z.infer<typeof tripInfoSchema>;
export type PassengerInfo = z.infer<typeof passengerInfoSchema>;
export type SeatInfo = z.infer<typeof seatInfoSchema>;
export type PaymentInfo = z.infer<typeof paymentInfoSchema>;
export type Booking = z.infer<typeof bookingSchema>;
