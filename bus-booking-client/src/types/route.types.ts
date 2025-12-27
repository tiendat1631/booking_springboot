export interface Route {
    id: string;
    name: string;
    departureStationId: string;
    arrivalStationId: string;
    departureStationName: string;
    arrivalStationName: string;
    distance: number;
    estimatedDuration: number; // in minutes
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRouteRequest {
    name: string;
    departureStationId: string;
    arrivalStationId: string;
    distance: number;
    estimatedDuration: number;
}
