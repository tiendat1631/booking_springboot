import { z } from "zod";

// Common validation patterns
const phoneRegex = /^0\d{9}$/;
const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;

// Reusable field validators
export const validators = {
    email: z.email("Invalid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must not exceed 100 characters"),

    phone: z
        .string()
        .regex(phoneRegex, "Phone number must have 10 digits and start with 0"),

    firstName: z
        .string()
        .min(1, "First name is required")
        .max(50, "First name must not exceed 50 characters")
        .regex(nameRegex, "First name can only contain letters"),

    lastName: z
        .string()
        .min(1, "Last name is required")
        .max(50, "Last name must not exceed 50 characters")
        .regex(nameRegex, "Last name can only contain letters"),

    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters")
        .regex(nameRegex, "Name can only contain letters"),

    uuid: z.string().uuid("Invalid ID"),

    otp: z
        .string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d+$/, "OTP can only contain numbers"),

    seatNumbers: z
        .array(z.string())
        .min(1, "Please select at least 1 seat"),

    date: z.string().refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date >= new Date(new Date().setHours(0, 0, 0, 0));
    }, "Invalid date or date has passed"),
};

// Form schemas
export const loginSchema = z.object({
    email: validators.email,
    password: validators.password,
});

export const registerSchema = z.object({
    firstName: validators.firstName,
    lastName: validators.lastName,
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
