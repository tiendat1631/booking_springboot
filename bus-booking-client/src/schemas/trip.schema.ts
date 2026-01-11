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
    tripId: z.uuid(),
    
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


// Trip Detail schemas (for booking page)
export const routeDetailSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    code: z.string(),
    departureProvinceName: z.string().nullable(),
    destinationProvinceName: z.string().nullable(),
    distanceKm: z.number().nullable(),
});

export const stationDetailSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    address: z.string(),
    provinceName: z.string().nullable(),
});

export const tripBusDetailSchema = z.object({
    id: z.uuid(),
    licensePlate: z.string(),
    type: z.string(),
    totalSeats: z.number(),
});

export const seatLayoutInfoSchema = z.object({
    totalRows: z.number(),
    totalColumns: z.number(),
});

export const seatInfoSchema = z.object({
    seatId: z.string(),
    row: z.number(),
    col: z.number(),
    status: z.string(),
    price: z.number(),
});

export const tripDetailSchema = z.object({
    tripId: z.uuid(),
    route: routeDetailSchema,
    bus: tripBusDetailSchema,
    departureStation: stationDetailSchema,
    destinationStation: stationDetailSchema,
    departureTime: z.string(),
    arrivalTime: z.string(),
    formattedDuration: z.string(),
    durationMinutes: z.number(),
    price: z.number(),
    availableSeats: z.number(),
    totalSeats: z.number(),
    status: tripStatusEnum,
    seatLayout: seatLayoutInfoSchema.nullable(),
    seats: z.array(seatInfoSchema),
});

export type Trip = z.infer<typeof tripSchema>;
export type TripDetail = z.infer<typeof tripDetailSchema>;
export type RouteDetail = z.infer<typeof routeDetailSchema>;
export type StationDetail = z.infer<typeof stationDetailSchema>;
export type TripBusDetail = z.infer<typeof tripBusDetailSchema>;
export type SeatLayoutInfo = z.infer<typeof seatLayoutInfoSchema>;
export type SeatInfo = z.infer<typeof seatInfoSchema>;