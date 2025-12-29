import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Clock, MapPin, Bus, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { TripDetailResponse } from "@/types";

interface TripSummaryCardProps {
    trip: TripDetailResponse;
}

export function TripSummaryCard({ trip }: TripSummaryCardProps) {
    const departureTime = new Date(trip.departureTime);
    const arrivalTime = new Date(trip.arrivalTime);

    return (
        <Card>
            <CardContent className="pt-6">
                {/* Route & Time */}
                <div className="flex items-start gap-4 mb-4">
                    {/* Departure */}
                    <div className="text-center min-w-[80px]">
                        <div className="text-2xl font-bold">
                            {format(departureTime, "HH:mm")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {format(departureTime, "dd/MM/yyyy", { locale: vi })}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex-1 pt-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="size-2.5 rounded-full bg-primary shrink-0" />
                            <div className="flex-1 h-px bg-gradient-to-r from-primary via-muted-foreground/30 to-primary" />
                            <div className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="size-3" />
                                {trip.formattedDuration}
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-primary via-muted-foreground/30 to-primary" />
                            <div className="size-2.5 rounded-full bg-primary shrink-0" />
                        </div>
                        
                        {/* Stations */}
                        <div className="flex justify-between text-sm">
                            <div className="flex items-start gap-1.5 max-w-[45%]">
                                <MapPin className="size-3.5 text-primary mt-0.5 shrink-0" />
                                <div>
                                    <div className="font-medium leading-tight">{trip.route.departureStation.name}</div>
                                    <div className="text-xs text-muted-foreground">{trip.route.departureStation.provinceName}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-1.5 max-w-[45%] text-right">
                                <div>
                                    <div className="font-medium leading-tight">{trip.route.arrivalStation.name}</div>
                                    <div className="text-xs text-muted-foreground">{trip.route.arrivalStation.provinceName}</div>
                                </div>
                                <MapPin className="size-3.5 text-primary mt-0.5 shrink-0" />
                            </div>
                        </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-center min-w-[80px]">
                        <div className="text-2xl font-bold">
                            {format(arrivalTime, "HH:mm")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {format(arrivalTime, "dd/MM/yyyy", { locale: vi })}
                        </div>
                    </div>
                </div>

                <Separator className="my-4" />

                {/* Bus Info */}
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Bus className="size-4 text-muted-foreground" />
                        <span className="font-medium">{trip.bus.type}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="font-mono text-muted-foreground">{trip.bus.licensePlate}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <Users className="size-4 text-muted-foreground" />
                        <span>{trip.availableSeats} seats available</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
