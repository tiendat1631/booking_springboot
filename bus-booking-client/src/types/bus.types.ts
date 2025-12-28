// Bus types based on API response
export type BusType = "SEATER" | "SLEEPER" | "LIMOUSINE";
export type BusStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export interface Bus {
    id: string;
    licensePlate: string;
    type: BusType;
    status: BusStatus;
    totalSeats: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBusRequest {
    licensePlate: string;
    type: BusType;
    totalSeats: number;
}
