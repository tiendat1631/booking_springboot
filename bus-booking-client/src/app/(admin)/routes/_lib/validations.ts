import { createSearchParamsCache, parseAsBoolean, parseAsInteger, parseAsString } from "nuqs/server";
import * as z from "zod";

import { getSortingStateParser } from "@/lib/parsers";

// Route station schema
const routeStationSchema = z.object({
    id: z.string(),
    name: z.string(),
    provinceName: z.string(),
});

// Route schema
export const routeSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    departureStation: routeStationSchema,
    arrivalStation: routeStationSchema,
    distanceKm: z.number(),
    estimatedDurationMinutes: z.number(),
    formattedDuration: z.string(),
    basePrice: z.number(),
    description: z.string().nullable(),
    active: z.boolean(),
});

export type Route = z.infer<typeof routeSchema>;

// Create route form schema (matches API CreateRouteRequest)
export const createRouteSchema = z.object({
    name: z.string().min(1, "Route name is required"),
    departureStationId: z.string().min(1, "Departure station is required"),
    arrivalStationId: z.string().min(1, "Arrival station is required"),
    distanceKm: z.number().positive("Distance must be positive"),
    estimatedDurationMinutes: z.number().positive("Duration must be positive"),
    basePrice: z.number().positive("Base price must be positive"),
    description: z.string().optional(),
});

export type CreateRouteInput = z.infer<typeof createRouteSchema>;

// Search params cache for routes table
export const searchRoutesParamsCache = createSearchParamsCache({
    // Pagination
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),

    // Sorting
    sort: getSortingStateParser<Route>().withDefault([
        { id: "name", desc: false },
    ]),

    // Filters
    name: parseAsString.withDefault(""),
    code: parseAsString.withDefault(""),
    active: parseAsBoolean,
});

export type GetRoutesSchema = Awaited<
    ReturnType<typeof searchRoutesParamsCache.parse>
>;
