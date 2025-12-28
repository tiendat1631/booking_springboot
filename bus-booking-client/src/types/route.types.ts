// Route types based on API response
export interface RouteStation {
    id: string;
    name: string;
    provinceName: string;
}

export interface Route {
    id: string;
    name: string;
    code: string;
    departureStation: RouteStation;
    arrivalStation: RouteStation;
    distanceKm: number;
    estimatedDurationMinutes: number;
    formattedDuration: string;
    basePrice: number;
    description: string | null;
    active: boolean;
}

export interface CreateRouteRequest {
    name: string;
    code: string;
    departureStationId: string;
    arrivalStationId: string;
    distanceKm: number;
    estimatedDurationMinutes: number;
    basePrice: number;
    description?: string;
}
