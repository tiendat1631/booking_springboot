import * as z from "zod";
import { provinceSchema } from "./province.schema";

export const stationSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    address: z.string(),
    province: provinceSchema,
    latitude: z.number(),
    longitude: z.number(),
    active: z.boolean(),
});

export type Station = z.infer<typeof stationSchema>;

