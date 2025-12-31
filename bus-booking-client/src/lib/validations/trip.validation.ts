import * as z from "zod";
import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";
import { getSortingStateParser } from "../parsers";
import { Trip } from "@/schemas/trip.schema";
    
export const searchTripsParamsCache = createSearchParamsCache({
    // Pagination
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),

    // Sorting
    sort: getSortingStateParser<Trip>().withDefault([
        { id: "departureTime", desc: false },
    ]),

    // Filters
    status: parseAsString.withDefault(""),
    routeCode: parseAsString.withDefault(""),
    busLicensePlate: parseAsString.withDefault(""),
    departureStationName: parseAsString.withDefault(""),
    arrivalStationName: parseAsString.withDefault(""),
    departureTime: parseAsString.withDefault(""), 
    busType: parseAsString.withDefault(""),
});

export const createTripSchema = z.object({
    busId: z.uuid("Invalid Bus ID"),
        
    departureStationId: z.uuid("Invalid Station ID"),
    destinationStationId: z.uuid("Invalid Station ID"),

    departureTime: z.coerce
        .date("Departure time is required")
        .refine((date) => date > new Date(), {
            message: "Departure time must be in the future",
        }),
    arrivalTime: z.coerce
        .date("Arrival time is required")
        .refine((date) => date > new Date(), {
            message: "Arrival time must be in the future",
        }),

    price: z.coerce
        .number("Price must be a number")
        .positive("Price must be positive"),
})
.superRefine((data, ctx) => {
    if (data.departureTime && data.arrivalTime && data.arrivalTime <= data.departureTime) {
        ctx.addIssue({
        code: "custom",
        message: "Arrival time must be after departure time",
        path: ["arrivalTime"], 
        });
    }

    if (data.departureStationId && data.destinationStationId && data.departureStationId === data.destinationStationId) {
        ctx.addIssue({
            code: "custom",
            message: "Departure and Destination stations cannot be the same",
            path: ["destinationStationId"], 
        });
    }
});


export type GetTripsSchema = Awaited<
    ReturnType<typeof searchTripsParamsCache.parse>
>;
