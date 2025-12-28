"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { createRouteSchema, type CreateRouteInput } from "../_lib/validations";
import type { ApiResponse, ActionResult } from "@/types";
import type { Route } from "@/types/route.types";

export async function createRoute(
    input: CreateRouteInput
): Promise<ActionResult<Route>> {
    try {
        const validated = createRouteSchema.safeParse(input);

        if (!validated.success) {
            return {
                success: false,
                error: validated.error.issues[0]?.message ?? "Invalid input",
            };
        }

        const response = await apiPost<ApiResponse<Route>>(
            API_ENDPOINTS.ROUTES.BASE,
            validated.data
        );

        if (!response.success) {
            return {
                success: false,
                error: "Failed to create route",
            };
        }

        revalidatePath("/routes");
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
