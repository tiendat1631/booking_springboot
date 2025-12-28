import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";
import * as z from "zod";

import { getSortingStateParser } from "@/lib/parsers";

// Bus type enum
export const busTypeEnum = z.enum(["SEATER", "SLEEPER", "LIMOUSINE"]);
export const busStatusEnum = z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]);

// Bus schema
export const busSchema = z.object({
    id: z.string(),
    licensePlate: z.string(),
    type: busTypeEnum,
    status: busStatusEnum,
    totalSeats: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Bus = z.infer<typeof busSchema>;

// Create bus form schema (matches API CreateBusRequest)
export const createBusSchema = z.object({
    licensePlate: z.string().min(1, "License plate is required"),
    type: busTypeEnum,
});

export type CreateBusInput = z.infer<typeof createBusSchema>;

// Search params cache for buses table
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

export type GetBusesSchema = Awaited<
    ReturnType<typeof searchBusesParamsCache.parse>
>;
