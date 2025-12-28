export interface Province {
    code: number;
    name: string;
    codename: string;
}

export interface Station {
    id: string;
    name: string;
    address: string;
    province: Province;
    latitude?: number;
    longitude?: number;
    active: boolean;
}

export interface StationOption {
    value: string;
    label: string;
    province: string;
}
