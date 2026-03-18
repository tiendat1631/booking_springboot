export type PopularTrip = {
  tripId: string;
  routeCode: string;
  departureProvince: string;
  destinationProvince: string;
  bookingCount: number;
};

export type DashboardStatisticResponse = {
  totalBookings: number;
  totalTrips: number;
  totalTicketsSold: number;
  revenueToday: number;
  revenueThisMonth: number;
  revenueThisYear: number;
  totalRevenueByTrip: number;
  popularTrips: PopularTrip[];
};

export type TripStatisticResponse = {
  totalTicketsSold: number;
  totalTicketsCancelled: number;
  revenueOfTrip: number;
};