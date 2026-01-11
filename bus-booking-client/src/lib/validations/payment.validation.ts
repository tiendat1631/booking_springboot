import { paymentMethodEnum } from "@/schemas/payment.schema";
import * as z from "zod";

export const createPaymentSchema = z.object({
    bookingId: z.uuid(),
    method: paymentMethodEnum,
    returnUrl: z.url().optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
