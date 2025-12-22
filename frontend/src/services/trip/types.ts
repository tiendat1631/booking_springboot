export type TripResponse = {
    id: string;
    departureName: string;
    destinationName: string;
    departureTime: string; // ví dụ: dayjs(trip.departureTime).format('HH:mm')
    arrivalTime: string;   // ví dụ: dayjs(trip.arrivalTime).format('HH:mm')
    bus: BusData;
    tickets: TicketData[];
    ticketPrice: number;
}

export type BusData = {
    id: string;
    licensePlate: string;
    capacity: number;
    type: string;
}


export type TripQueryString = {
    departureCode: number,
    destinationCode: number,
    departureTime: string,
    ticketNum: number
}

type TicketData = {
    id: string
    seatNum: number,
    isOccupied: boolean
}

