"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiPost } from "@/lib/api";
import { API_ENDPOINTS, ROUTES } from "@/lib/constants";
import { loginSchema, registerSchema } from "@/lib/validators";
import type { ActionResult, AuthResponse } from "@/types";

/**
 * Login user with email and password
 */
export async function login(
    _prevState: ActionResult<void> | null,
    formData: FormData
): Promise<ActionResult<void>> {
    try {
        const rawData = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };

        const validated = loginSchema.safeParse(rawData);
        if (!validated.success) {
            const fieldErrors: Record<string, string[]> = {};
            validated.error.issues.forEach((issue) => {
                const field = issue.path[0] as string;
                if (!fieldErrors[field]) fieldErrors[field] = [];
                fieldErrors[field].push(issue.message);
            });
            return {
                success: false,
                error: validated.error.issues[0]?.message || "Dữ liệu không hợp lệ",
                fieldErrors,
            };
        }

        const response = await apiPost<AuthResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            validated.data
        );

        // Set cookies
        const cookieStore = await cookies();
        const isProduction = process.env.NODE_ENV === "production";

        cookieStore.set("accessToken", response.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        cookieStore.set("refreshToken", response.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        cookieStore.set("user", JSON.stringify(response.user), {
            httpOnly: false, // Accessible from client for UI
            secure: isProduction,
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Đăng nhập thất bại",
        };
    }
}

/**
 * Register new user
 */
export async function register(
    _prevState: ActionResult<void> | null,
    formData: FormData
): Promise<ActionResult<void>> {
    try {
        const rawData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            phone: formData.get("phone") as string,
        };

        const validated = registerSchema.safeParse(rawData);
        if (!validated.success) {
            const fieldErrors: Record<string, string[]> = {};
            validated.error.issues.forEach((issue) => {
                const field = issue.path[0] as string;
                if (!fieldErrors[field]) fieldErrors[field] = [];
                fieldErrors[field].push(issue.message);
            });
            return {
                success: false,
                error: validated.error.issues[0]?.message || "Dữ liệu không hợp lệ",
                fieldErrors,
            };
        }

        await apiPost(API_ENDPOINTS.AUTH.REGISTER, validated.data);

        return { success: true, data: undefined };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Đăng ký thất bại",
        };
    }
}

/**
 * Logout user and clear cookies
 */
export async function logout(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("user");
    cookieStore.delete("expiresAt");

    redirect(ROUTES.LOGIN);
}
