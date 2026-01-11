import * as z from "zod";
import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";
import { getSortingStateParser } from "@/lib/parsers";
import { Booking, bookingStatusEnum } from "@/schemas/booking.schema";
import { paymentStatusEnum } from "@/schemas/payment.schema";

export const searchBookingsParamsCache = createSearchParamsCache({
    // Pagination
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),

    // Sorting
    sort: getSortingStateParser<Booking>().withDefault([
        { id: "bookingTime", desc: true },
    ]),

    // Filters
    bookingCode: parseAsString.withDefault(""),
    passengerName: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
    paymentStatus: parseAsString.withDefault(""),
});

export type GetBookingsSchema = Awaited<
    ReturnType<typeof searchBookingsParamsCache.parse>
>;

export const createBookingSchema = z.object({
    tripId: z.string(),
    seatIds: z.array(z.string()),
    passengerName: z.string(),
    passengerPhone: z.string(),
    passengerEmail: z.string(),
    notes: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
