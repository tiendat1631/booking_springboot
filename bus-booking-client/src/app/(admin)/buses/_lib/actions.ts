"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { createBusSchema, type CreateBusInput } from "../_lib/validations";
import type { ApiResponse, ActionResult, Bus } from "@/types";

export async function createBus(
    input: CreateBusInput
): Promise<ActionResult<Bus>> {
    try {
        const validated = createBusSchema.safeParse(input);

        if (!validated.success) {
            return {
                success: false,
                error: validated.error.issues[0]?.message ?? "Invalid input",
            };
        }

        const response = await apiPost<ApiResponse<Bus>>(
            API_ENDPOINTS.BUSES.BASE,
            validated.data
        );

        if (!response.success) {
            return {
                success: false,
                error: "Failed to create bus",
            };
        }

        revalidatePath("/buses");
        updateTag("buses");

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("Create bus error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        };
    }
}
