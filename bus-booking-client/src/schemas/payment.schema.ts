import * as z from "zod";

export const paymentMethodEnum = z.enum(["VNPAY", "MOMO", "CASH"]);
export const paymentStatusEnum = z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]);

export const paymentSchema = z.object({
    paymentId: z.uuid(),
    bookingId: z.uuid(),
    bookingCode: z.string(),
    method: paymentMethodEnum,
    status: paymentStatusEnum,
    amount: z.number(),
    transactionId: z.string().nullable(),
    paidAt: z.string().nullable(),
    paymentUrl: z.string().nullable(),
    paymentNote: z.string().nullable(),
});

export type Payment = z.infer<typeof paymentSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodEnum>;
export type PaymentStatus = z.infer<typeof paymentStatusEnum>;