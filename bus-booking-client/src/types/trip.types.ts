// Trip types based on API response
export type TripStatus = "SCHEDULED" | "BOARDING" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED";

import type { BusType } from "./bus.types";
export type { BusType };

// Trip route summary in list view
export interface TripRouteSummary {
    id: string;
    name: string;
    code: string;
    departureStation: string;
    departureProvince: string;
    arrivalStation: string;
    arrivalProvince: string;
}

// Trip bus summary in list view
export interface TripBusSummary {
    id: string;
    licensePlate: string;
    type: BusType;
}

// Trip summary for list view
export interface TripSummary {
    tripId: string;
    route: TripRouteSummary;
    bus: TripBusSummary;
    departureTime: string;
    arrivalTime: string;
    formattedDuration: string;
    price: number;
    availableSeats: number;
    totalSeats: number;
    status: TripStatus;
}

// Legacy types for backward compatibility
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
