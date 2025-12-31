import * as z from "zod";

export const busTypeEnum = z.enum(["SEATER", "SLEEPER", "LIMOUSINE"]);
export const busStatusEnum = z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]);

export const busSchema = z.object({
    id: z.uuid(),
    licensePlate: z.string(),
    type: busTypeEnum,
    status: busStatusEnum,
    totalSeats: z.number(), 
    updatedAt: z.string(),
});

const seatSchema = z.object({
    seatId: z.string(),
    row: z.number(),
    col: z.number(),
    isActive: z.boolean()
});

const seatLayoutSchema = z.object({
    totalColumns: z.number(),
    totalRows: z.number(),
    seats: z.array(seatSchema)
});

export const busDetailSchema = busSchema.extend({
    createdAt: z.string(),
    seatLayout: seatLayoutSchema
});

export type BusDetail = z.infer<typeof busDetailSchema>;
export type Bus = z.infer<typeof busSchema>;