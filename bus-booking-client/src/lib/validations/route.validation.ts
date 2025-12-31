import * as z from "zod";
import { createSearchParamsCache, parseAsBoolean, parseAsInteger, parseAsString } from "nuqs/server";
import { getSortingStateParser } from "@/lib/parsers";
import { Route } from "@/schemas/route.schema";
import { provinceSchema } from "@/schemas/province.schema";

export const searchRoutesParamsCache = createSearchParamsCache({
    // Pagination
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),

    // Sorting
    sort: getSortingStateParser<Route>().withDefault([
        { id: "code", desc: false },
    ]),

    // Filters
    code: parseAsString.withDefault(""),
    name: parseAsString.withDefault(""),
    departureProvince: parseAsString.withDefault(""),
    destinationProvince: parseAsString.withDefault(""),
    active: parseAsBoolean,
});

export const createRouteSchema = z.object({
    departureProvince: provinceSchema,
    destinationProvince: provinceSchema,

    distanceKm: z.number().positive().min(1, "Distance must be greater than 0"),
    estimatedDurationMinutes: z.number().positive().min(1, "Duration must be greater than 0"),
    basePrice: z.number().positive().min(1, "Base price must be greater than 0"),

    active: z.boolean(),
})
.refine((data) => data.departureProvince.code !== data.destinationProvince.code, {
    message: "Departure and Destination provinces cannot be the same",
    path: ["destinationProvince", "arrivalProvince"], 
});

export type CreateRouteInput = z.infer<typeof createRouteSchema>;

export type GetRoutesSchema = Awaited<
    ReturnType<typeof searchRoutesParamsCache.parse>
>;