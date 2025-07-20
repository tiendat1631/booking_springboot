export type SearchTicketParams = {
  from: string;
  to: string;
  date?: Date;
  ticket: number;
};

export type TicketInfo = {
  name: string;
  phone: string;
  ticketCode: string;
  trip: string;
  departureTime: string;
  seatNumber: string;
  price: number;
};

export type BookingLookup = {
  ticketCode: string;
  phoneNum: string;
}