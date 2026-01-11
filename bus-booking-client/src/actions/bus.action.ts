"use server";

import { apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { CreateBusInput, createBusSchema } from "@/lib/validations/bus.validation";
import { Bus } from "@/schemas/bus.schema";
import { ActionResult, ApiResponse, isApiSuccess } from "@/type";
import { updateTag } from "next/cache";

export async function createBus(
    input: CreateBusInput
): Promise<ActionResult<Bus>> {
    const parsed = createBusSchema.safeParse(input);

    if (!parsed.success) {
        return {
            success: false,
            error: "Invalid input",
        };
    }

    try{
        const response = await apiPost<ApiResponse<Bus>>(
            API_ENDPOINTS.BUSES.BASE,
            parsed.data
        );

        if (!isApiSuccess(response)) {
            return {
                success: false,
                error: response.message,
            };
        }

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