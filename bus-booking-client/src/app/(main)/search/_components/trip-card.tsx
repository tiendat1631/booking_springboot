"use client";

import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Clock, Users, Bus, Armchair, BedDouble, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { TripSummary } from "@/types/trip.types";

interface TripCardProps {
    trip: TripSummary;
    passengers: number;
}

function getBusTypeIcon(type: string) {
    switch (type) {
        case "SEATER":
            return <Armchair className="size-4" />;
        case "SLEEPER":
            return <BedDouble className="size-4" />;
        case "LIMOUSINE":
            return <Bus className="size-4" />;
        default:
            return <Bus className="size-4" />;
    }
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

export function TripCard({ trip, passengers }: TripCardProps) {
    const departureTime = new Date(trip.departureTime);
    const arrivalTime = new Date(trip.arrivalTime);
    const hasAvailableSeats = trip.availableSeats >= passengers;
    const totalPrice = trip.price * passengers;

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow py-0 gap-0">
            {/* Header Bar */}
            <div className="px-3 py-2 flex items-center justify-between border-b">
                <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="gap-1.5">
                        {getBusTypeIcon(trip.bus.type)}
                        {trip.bus.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground font-mono">
                        {trip.bus.licensePlate}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="size-4" />
                    <span>{trip.availableSeats} seats available</span>
                </div>
            </div>

            {/* Main Content */}
            <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Journey Info */}
                    <div className="flex-1">
                        <div className="flex items-start gap-4">
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
                                <div className="flex items-center gap-2 mb-1">
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
                                <div className="flex justify-between mt-2 text-sm">
                                    <div className="flex items-start gap-1.5 max-w-[45%]">
                                        <MapPin className="size-3.5 text-primary mt-0.5 shrink-0" />
                                        <div>
                                            <div className="font-medium leading-tight">{trip.route.departureStation}</div>
                                            <div className="text-xs text-muted-foreground">{trip.route.departureProvince}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-1.5 max-w-[45%] text-right">
                                        <div>
                                            <div className="font-medium leading-tight">{trip.route.arrivalStation}</div>
                                            <div className="text-xs text-muted-foreground">{trip.route.arrivalProvince}</div>
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
                    </div>

                    {/* Divider */}
                    <div className="hidden lg:block w-px h-24 bg-border" />
                    <div className="lg:hidden h-px w-full bg-border" />

                    {/* Price & Action */}
                    <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:min-w-[160px]">
                        <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                                {formatPrice(totalPrice)}
                            </div>
                            {passengers > 1 && (
                                <div className="text-xs text-muted-foreground">
                                    {formatPrice(trip.price)}/person
                                </div>
                            )}
                        </div>

                        <Button 
                            asChild 
                            size="lg"
                            className="min-w-[120px]"
                            disabled={!hasAvailableSeats}
                        >
                            <Link href={`/booking/${trip.tripId}?passengers=${passengers}`}>
                                {hasAvailableSeats ? "Select" : "Sold Out"}
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
