import * as z from "zod";
import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";
import { getSortingStateParser } from "@/lib/parsers";

import { Bus, busTypeEnum } from "@/schemas/bus.schema";


export const searchBusesParamsCache = createSearchParamsCache({
    // Pagination
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),

    // Sorting
    sort: getSortingStateParser<Bus>().withDefault([
        { id: "licensePlate", desc: false },
    ]),

    // Filters
    licensePlate: parseAsString.withDefault(""),
    type: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
});

export const createBusSchema = z.object({
    licensePlate: z.string().min(1, "License plate is required"),
    type: busTypeEnum,
});


export type CreateBusInput = z.infer<typeof createBusSchema>;

export type GetBusesSchema = Awaited<
    ReturnType<typeof searchBusesParamsCache.parse>
>;