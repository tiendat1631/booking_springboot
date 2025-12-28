import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";
import * as z from "zod";

import { getSortingStateParser } from "@/lib/parsers";
import type { TripSummary } from "@/types/trip.types";

// Trip status enum
export const tripStatusEnum = z.enum(["SCHEDULED", "DEPARTED", "COMPLETED", "CANCELLED"]);
export const busTypeEnum = z.enum(["SEATER", "SLEEPER", "LIMOUSINE"]);

// Search params cache for trips table
export const searchTripsParamsCache = createSearchParamsCache({
    // Pagination
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),

    // Sorting - default by departureTime DESC
    sort: getSortingStateParser<TripSummary>().withDefault([
        { id: "departureTime", desc: true },
    ]),

    // Filters
    route: parseAsString.withDefault(""),
    busType: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
    fromDate: parseAsString.withDefault(""),
    toDate: parseAsString.withDefault(""),
});

export type GetTripsSchema = Awaited<
    ReturnType<typeof searchTripsParamsCache.parse>
>;
