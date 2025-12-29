// Trip types based on API response
export type TripStatus = "SCHEDULED" | "BOARDING" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED";
export type SeatStatus = "AVAILABLE" | "BOOKED" | "HELD" | "RESERVED";

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

// ============================================================================
// Trip Detail Response (for booking page)
// ============================================================================

export interface StationDetail {
    id: string;
    name: string;
    address: string;
    provinceName: string | null;
}

export interface RouteDetail {
    id: string;
    name: string;
    code: string;
    departureStation: StationDetail;
    arrivalStation: StationDetail;
    distanceKm: number | null;
}

export interface BusDetail {
    id: string;
    licensePlate: string;
    type: string;
    totalSeats: number;
}

export interface SeatLayoutInfo {
    totalRows: number;
    totalColumns: number;
}

export interface SeatInfo {
    seatId: string;
    row: number;
    col: number;
    status: SeatStatus;
    price: number;
}

export interface TripDetailResponse {
    tripId: string;
    route: RouteDetail;
    bus: BusDetail;
    departureTime: string;
    arrivalTime: string;
    formattedDuration: string;
    durationMinutes: number;
    price: number;
    availableSeats: number;
    totalSeats: number;
    status: TripStatus;
    seatLayout: SeatLayoutInfo | null;
    seats: SeatInfo[];
}

// ============================================================================
// Search params
// ============================================================================

export interface TripSearchByProvinceParams {
    departureProvince: string;
    arrivalProvince: string;
    departureDate: string;
    passengers?: number;
    page?: number;
    size?: number;
}
