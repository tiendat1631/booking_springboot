"use server";

import { apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { CreateStationInput, createStationSchema } from "@/lib/validations/station.validation";
import { Station } from "@/schemas/station.schema";
import { ActionResult, ApiResponse } from "@/type";
import { revalidatePath, updateTag } from "next/cache";

export async function createStation(
    input: CreateStationInput
): Promise<ActionResult<Station>> {
    const validated = createStationSchema.safeParse(input);

    if (!validated.success) {
        return {
            success: false,
            error: "Invalid input",
        };
    }

    try {
        const response = await apiPost<ApiResponse<Station>>(
            API_ENDPOINTS.STATIONS.BASE,
            validated.data
        );

        if (!response.success) {
            return {
                success: false,
                error: response.message,
            };
        }

        updateTag("stations");

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("Create station error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        };
    }
}
