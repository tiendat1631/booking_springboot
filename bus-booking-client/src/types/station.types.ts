export interface Station {
    id: string;
    name: string;
    address: string;
    city: string;
    province: string;
    latitude?: number;
    longitude?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface StationOption {
    value: string;
    label: string;
    city: string;
}
