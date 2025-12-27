import { z } from "zod";

// Common validation patterns
const phoneRegex = /^0\d{9}$/;
const vietnameseNameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;

// Reusable field validators
export const validators = {
    email: z.string().email("Email không hợp lệ"),

    password: z
        .string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .max(100, "Mật khẩu không được quá 100 ký tự"),

    phone: z
        .string()
        .regex(phoneRegex, "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0"),

    name: z
        .string()
        .min(2, "Tên phải có ít nhất 2 ký tự")
        .max(100, "Tên không được quá 100 ký tự")
        .regex(vietnameseNameRegex, "Tên chỉ được chứa chữ cái"),

    uuid: z.string().uuid("ID không hợp lệ"),

    otp: z
        .string()
        .length(6, "OTP phải có 6 chữ số")
        .regex(/^\d+$/, "OTP chỉ được chứa số"),

    seatNumbers: z
        .array(z.string())
        .min(1, "Vui lòng chọn ít nhất 1 ghế"),

    date: z.string().refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date >= new Date(new Date().setHours(0, 0, 0, 0));
    }, "Ngày không hợp lệ hoặc đã qua"),
};

// Form schemas
export const loginSchema = z.object({
    email: validators.email,
    password: validators.password,
});

export const registerSchema = z.object({
    name: validators.name,
    email: validators.email,
    password: validators.password,
    phone: validators.phone,
});

export const bookingSchema = z.object({
    tripId: validators.uuid,
    seatNumbers: validators.seatNumbers,
    customerName: validators.name,
    customerEmail: validators.email,
    customerPhone: validators.phone,
});

export const cancelBookingSchema = z.object({
    bookingId: validators.uuid,
    otp: validators.otp,
});

export const searchTripSchema = z.object({
    departureStationId: validators.uuid.optional(),
    arrivalStationId: validators.uuid.optional(),
    departureDate: z.string().optional(),
    page: z.coerce.number().min(0).optional(),
    size: z.coerce.number().min(1).max(50).optional(),
});

// Type exports from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type SearchTripInput = z.infer<typeof searchTripSchema>;
