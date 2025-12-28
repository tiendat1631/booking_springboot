import { cache } from "react";
import type { Province } from "@/types/station.types";

const PROVINCES_API_URL = "https://provinces.open-api.vn/api";

/**
 * Get all Vietnam provinces from open-api.vn
 */
export const getVNProvinces = cache(async (): Promise<Province[]> => {
    const response = await fetch(`${PROVINCES_API_URL}/p/`, {
        next: {
            revalidate: 86400, // 24 hours
            tags: ["vn-provinces"],
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

/**
 * Get province by code
 */
export const getVNProvinceByCode = cache(async (code: number): Promise<Province | null> => {
    const response = await fetch(`${PROVINCES_API_URL}/p/${code}`, {
        next: {
            revalidate: 86400,
            tags: ["vn-provinces", `vn-province-${code}`],
        },
    });

    if (!response.ok) {
        console.error(`Failed to fetch province ${code}:`, response.statusText);
        return null;
    }

    const data = await response.json();
    return {
        code: data.code,
        name: data.name,
        codename: data.codename,
    };
});
