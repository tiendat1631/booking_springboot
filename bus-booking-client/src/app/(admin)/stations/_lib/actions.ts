"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { createStationSchema, type CreateStationInput } from "../_lib/validations";
import type { ApiResponse, ActionResult } from "@/types";
import type { Station } from "@/types/station.types";

export async function createStation(
    input: CreateStationInput
): Promise<ActionResult<Station>> {
    try {
        const validated = createStationSchema.safeParse(input);

        if (!validated.success) {
            return {
                success: false,
                error: validated.error.issues[0]?.message ?? "Invalid input",
            };
        }

        const response = await apiPost<ApiResponse<Station>>(
            API_ENDPOINTS.STATIONS.BASE,
            validated.data
        );

        if (!response.success) {
            return {
                success: false,
                error: "Failed to create station",
            };
        }

        revalidatePath("/stations");
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
