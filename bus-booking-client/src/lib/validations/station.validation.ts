import { provinceSchema } from "@/schemas/province.schema";
import { createSearchParamsCache, parseAsBoolean, parseAsInteger, parseAsString } from "nuqs/server";
import * as z from "zod";
import { getSortingStateParser } from "../parsers";
import { Station } from "@/schemas/station.schema";
    
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

export const createStationSchema = z.object({
    name: z.string().min(1, "Station name is required"),
    address: z.string().min(1, "Address is required"),
    province: provinceSchema,
});

export type GetStationsSchema = Awaited<
    ReturnType<typeof searchStationsParamsCache.parse>
>;

export type CreateStationInput = z.infer<typeof createStationSchema>;