export type TripStatus = "SCHEDULED" | "DEPARTED" | "COMPLETED" | "CANCELLED";

export interface Trip {
    id: string;
    routeId: string;
    busId: string;
    departureStationId: string;
    arrivalStationId: string;
    departureStationName: string;
    arrivalStationName: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    availableSeats: number;
    totalSeats: number;
    status: TripStatus;
    busNumber: string;
    busType: string;
}

export interface TripDetails extends Trip {
    route: {
        id: string;
        name: string;
        distance: number;
        estimatedDuration: number;
    };
    seats: SeatInfo[];
}

export interface SeatInfo {
    seatNumber: string;
    isAvailable: boolean;
    price: number;
}

export interface TripSearchParams {
    departureStationId?: string;
    arrivalStationId?: string;
    departureDate?: string;
    page?: number;
    size?: number;
}
