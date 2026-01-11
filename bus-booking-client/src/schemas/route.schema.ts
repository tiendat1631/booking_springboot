import * as z from "zod";
import { provinceSchema } from "./province.schema";

export const routeSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    code: z.string(),
    departureProvince: provinceSchema,
    destinationProvince: provinceSchema,
    distanceKm: z.number(),
    estimatedDurationMinutes: z.number(),
    basePrice: z.number(),
    active: z.boolean(),
});

export const routeSummarySchema = z.object({
    code: z.string(),
    name: z.string(),
});

export type Route = z.infer<typeof routeSchema>;
export type RouteSummary = z.infer<typeof routeSummarySchema>;