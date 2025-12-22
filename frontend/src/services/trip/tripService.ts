import { TripResponse, TripQueryString as TripQueryParams } from "./types";
import fetcher, { ApiResponse } from "@/lib/fetcher";

export async function SearchTrips(params: TripQueryParams): Promise<ApiResponse<TripResponse[]>> {
  return await fetcher({
    method: "GET",
    route: "trip",
    options: {
      params: params
    }
  });
}
