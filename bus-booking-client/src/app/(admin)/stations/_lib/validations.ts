import { createSearchParamsCache, parseAsBoolean, parseAsInteger, parseAsString } from "nuqs/server";
import * as z from "zod";

import { getSortingStateParser } from "@/lib/parsers";

// Province schema
export const provinceSchema = z.object({
    code: z.number(),
    name: z.string(),
    codename: z.string(),
});

// Station schema
export const stationSchema = z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    province: provinceSchema,
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    active: z.boolean(),
});

export type Station = z.infer<typeof stationSchema>;

// Create station form schema
export const createStationSchema = z.object({
    name: z.string().min(1, "Station name is required"),
    address: z.string().min(1, "Address is required"),
    province: z.object({
        code: z.number({ message: "Province is required" }).min(1, "Province is required"),
        name: z.string().min(1, "Province name is required"),
        codename: z.string().optional(),
    }),
});

export type CreateStationInput = z.infer<typeof createStationSchema>;

// Search params cache for stations table
export const searchStationsParamsCache = createSearchParamsCache({
    // Pagination
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),

    // Sorting
    sort: getSortingStateParser<Station>().withDefault([
        { id: "name", desc: false },
    ]),

    // Filters
    name: parseAsString.withDefault(""),
    province: parseAsString.withDefault(""),
    active: parseAsBoolean,
});

export type GetStationsSchema = Awaited<
    ReturnType<typeof searchStationsParamsCache.parse>
>;
