import fetcher, { ApiResponse } from "@/lib/fetcher";
import { BookingLookup, SearchTicketParams, TicketInfo } from "./types";

export async function searchTicket({
  from,
  to,
  date,
  ticket,
}: SearchTicketParams) {
  return await fetcher({
    method: "GET",
    route: "trip",
    options: {
      params: {
        from,
        to,
        date: date ? date.toISOString().split("T")[0] : "",
        ticket,
      },
    },
  });
}

export async function lookupBooking({
  ticketCode,
  phoneNum,
}: BookingLookup): Promise<ApiResponse<TicketInfo>> {
  const fakeData: TicketInfo = {
    name: "Nguyễn Văn A",
    phone: "0912345678",
    ticketCode: "ACDS1234",
    trip: "Hà Nội → Sài Gòn",
    departureTime: "20/07/2025 - 07:00",
    seatNumber: "B12",
    price: 450000,
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        content: fakeData,
        statusCode: 200,
      });
    }, 1000);
  });
}
