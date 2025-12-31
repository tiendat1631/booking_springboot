"use server";

import { updateTag } from "next/cache";
import { apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { createTripSchema } from "@/lib/validations";
import type { ActionResult, ApiResponse } from "@/type";
import type { Trip } from "@/schemas";


// export async function createTrip(input: CreateTripInput): Promise<ActionResult<Trip>> {

//     const validated = createTripSchema.safeParse(input);

//     if (!validated.success) {
//         return {
//             success: false,
//             error: "Invalid input",
//         };
//     }

//     try {
//         const response = await apiPost<ApiResponse<Trip>>(
//             API_ENDPOINTS.TRIPS.BASE,
//             validated.data
//         );

//         if (!response.success) {
//             return {
//                 success: false,
//                 error: response.message,
//             };
//         }

//         updateTag("trips");

//         return {
//             success: true,
//             data: response.data,
//         };
//     } catch (error) {
//         console.error("Create trip error:", error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : "An unexpected error occurred",
//         };
//     }
// }
