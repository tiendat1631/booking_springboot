// import { format } from "date-fns";
// import { vi } from "date-fns/locale";
// import { ArrowRight } from "lucide-react";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import type { TripDetailResponse } from "@/type";

// interface BookingSummaryProps {
//     trip: TripDetailResponse;
//     passengers: number;
// }

// function formatPrice(price: number): string {
//     return new Intl.NumberFormat("vi-VN", {
//         style: "currency",
//         currency: "VND",
//     }).format(price);
// }

// export function BookingSummary({ trip, passengers }: BookingSummaryProps) {
//     const departureTime = new Date(trip.departureTime);
//     const arrivalTime = new Date(trip.arrivalTime);

//     return (
//         <div className="sticky top-24">
//             <Card>
//                 <CardHeader>
//                     <CardTitle className="text-lg">Booking Summary</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     {/* Route */}
//                     <div>
//                         <div className="text-sm text-muted-foreground mb-1">Route</div>
//                         <div className="flex items-center gap-2 font-medium">
//                             <span>{trip.route.departureStation.provinceName}</span>
//                             <ArrowRight className="size-4" />
//                             <span>{trip.route.arrivalStation.provinceName}</span>
//                         </div>
//                     </div>

//                     {/* Departure Station */}
//                     <div>
//                         <div className="text-sm text-muted-foreground mb-1">Departure Station</div>
//                         <div className="font-medium">{trip.route.departureStation.name}</div>
//                         <div className="text-xs text-muted-foreground">{trip.route.departureStation.address}</div>
//                     </div>

//                     {/* Arrival Station */}
//                     <div>
//                         <div className="text-sm text-muted-foreground mb-1">Arrival Station</div>
//                         <div className="font-medium">{trip.route.arrivalStation.name}</div>
//                         <div className="text-xs text-muted-foreground">{trip.route.arrivalStation.address}</div>
//                     </div>

//                     {/* Date */}
//                     <div>
//                         <div className="text-sm text-muted-foreground mb-1">Date & Time</div>
//                         <div className="font-medium">
//                             {format(departureTime, "EEEE, dd MMMM yyyy", { locale: vi })}
//                         </div>
//                         <div className="text-sm text-muted-foreground">
//                             {format(departureTime, "HH:mm")} - {format(arrivalTime, "HH:mm")} ({trip.formattedDuration})
//                         </div>
//                     </div>

//                     {/* Passengers */}
//                     <div>
//                         <div className="text-sm text-muted-foreground mb-1">Passengers</div>
//                         <div className="font-medium">{passengers} passenger(s)</div>
//                     </div>

//                     <Separator />

//                     {/* Price Info */}
//                     <div>
//                         <div className="flex justify-between text-sm mb-1">
//                             <span className="text-muted-foreground">Price per seat</span>
//                             <span>{formatPrice(trip.price)}</span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                             <span className="text-muted-foreground">Seats to select</span>
//                             <span>{passengers}</span>
//                         </div>
//                     </div>

//                     <Separator />

//                     {/* Total - Will be updated by SeatSelection */}
//                     <div id="booking-total" className="flex justify-between items-center">
//                         <span className="font-medium">Total</span>
//                         <span className="text-xl font-bold text-primary">
//                             {formatPrice(trip.price * passengers)}
//                         </span>
//                     </div>

//                     {/* Status Badge */}
//                     <Badge variant="outline" className="w-full justify-center py-2">
//                         Select up to {passengers} seat{passengers > 1 ? "s" : ""} to continue
//                     </Badge>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }
