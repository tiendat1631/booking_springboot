"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { CreateRouteInput, createRouteSchema } from "@/lib/validations/route.validation";
import type { ApiResponse, ActionResult } from "@/type";
import type { Route } from "@/schemas/route.schema";

export async function createRoute(
    input: CreateRouteInput
): Promise<ActionResult<Route>> {
    const validated = createRouteSchema.safeParse(input);

    if (!validated.success) {
        return {
            success: false,
            error: "Invalid input",
        };
    }

    try {
        const response = await apiPost<ApiResponse<Route>>(
            API_ENDPOINTS.ROUTES.BASE,
            validated.data
        );

        if (!response.success) {
            return {
                success: false,
                error: response.message,
            };
        }

        updateTag("routes");

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("Create route error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        };
    }
}
