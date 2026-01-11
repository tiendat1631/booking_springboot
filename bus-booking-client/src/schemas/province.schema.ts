import * as z from "zod";

export const provinceSchema = z.object({
    code: z.number(),
    name: z.string(),
    codename: z.string(),
});

export type Province = z.infer<typeof provinceSchema>;
