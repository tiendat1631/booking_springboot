import * as z from "zod";
import { busTypeEnum } from "./bus.schema";

export const tripStatusEnum = z.enum(["SCHEDULED", "BOARDING", "IN_TRANSIT", "COMPLETED", "CANCELLED"]);

const routeSummarySchema = z.object({
    id: z.uuid(),
    code: z.string(),
    name: z.string(),
});

const busSummarySchema = z.object({
    id: z.uuid(),
    licensePlate: z.string(),
    type: busTypeEnum,
});

const stationSummarySchema = z.object({
    id: z.uuid(),
    name: z.string(),
});

export const tripSchema = z.object({
    id: z.uuid(),
    
    route: routeSummarySchema,
    bus: busSummarySchema,
    
    departureStation: stationSummarySchema,
    destinationStation: stationSummarySchema,
    
    departureTime: z.date(), 
    arrivalTime: z.date(),
    durationMinutes: z.number(),
    
    price: z.number(),
    
    totalSeats: z.number(),
    availableSeats: z.number(),

    status: tripStatusEnum,
});

export type Trip = z.infer<typeof tripSchema>;