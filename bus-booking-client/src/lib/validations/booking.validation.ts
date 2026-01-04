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
