import { Province } from "@/schemas/province.schema";
import { cache } from "react";

const PROVINCES_API_URL = "https://provinces.open-api.vn/api";

/**
 * Get all Vietnam provinces from open-api.vn
 */
export const getVNProvinces = cache(async (): Promise<Province[]> => {
    const response = await fetch(`${PROVINCES_API_URL}/p/`, {
        next: {
            revalidate: 86400,
            tags: ["provinces"],
        },
    });

    if (!response.ok) {
        console.error("Failed to fetch provinces:", response.statusText);
        return [];
    }

    const data = await response.json();
    // Map to only include required fields
    return data.map((p: { code: number; name: string; codename: string }) => ({
        code: p.code,
        name: p.name,
        codename: p.codename,
    }));
});
