"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowRight, MapPin, Clock, Bus, Users, Armchair } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { TripDetail } from "@/schemas";

interface BookingSummaryProps {
    trip: TripDetail;
    passengers: number;
    selectedSeats?: string[];
    totalPrice?: number;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

export function BookingSummary({ 
    trip, 
    passengers, 
    selectedSeats = [], 
    totalPrice 
}: BookingSummaryProps) {
    const departureTime = new Date(trip.departureTime);
    const arrivalTime = new Date(trip.arrivalTime);
    
    // Calculate display price
    const displayPrice = totalPrice ?? (selectedSeats.length > 0 
        ? selectedSeats.length * trip.price 
        : passengers * trip.price);

    return (
        <div className="sticky top-24">
            <Card>
                <CardHeader className="bg-primary/5">
                    <CardTitle className="text-lg">Thông tin chuyến đi</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    {/* Route */}
                    <div>
                        <div className="flex items-center gap-2 font-medium text-lg">
                            <span>{trip.route.departureProvinceName}</span>
                            <ArrowRight className="size-4 text-primary" />
                            <span>{trip.route.destinationProvinceName}</span>
                        </div>
                        <Badge variant="outline" className="mt-1 font-mono text-xs">
                            {trip.route.code}
                        </Badge>
                    </div>

                    <Separator />

                    {/* Stations */}
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className="size-3 rounded-full bg-primary ring-4 ring-primary/20" />
                                <div className="w-0.5 flex-1 bg-linear-to-b from-primary to-muted" />
                            </div>
                            <div className="flex-1 pb-4">
                                <div className="text-xs text-muted-foreground mb-1">Điểm đón</div>
                                <div className="font-medium">{trip.departureStation.name}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin className="size-3" />
                                    {trip.departureStation.address}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className="size-3 rounded-full bg-primary ring-4 ring-primary/20" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-muted-foreground mb-1">Điểm đến</div>
                                <div className="font-medium">{trip.destinationStation.name}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin className="size-3" />
                                    {trip.destinationStation.address}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Date & Time */}
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Clock className="size-5 text-primary" />
                        </div>
                        <div>
                            <div className="font-medium">
                                {format(departureTime, "EEEE, dd/MM/yyyy", { locale: vi })}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {format(departureTime, "HH:mm")} - {format(arrivalTime, "HH:mm")} ({trip.formattedDuration})
                            </div>
                        </div>
                    </div>

                    {/* Bus Info */}
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Bus className="size-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="font-medium">{trip.bus.type}</div>
                            <div className="text-sm text-muted-foreground font-mono">{trip.bus.licensePlate}</div>
                        </div>
                    </div>

                    <Separator />

                    {/* Selected Seats */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Armchair className="size-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Ghế đã chọn</span>
                        </div>
                        {selectedSeats.length > 0 ? (
                            <div className="flex gap-1.5 flex-wrap">
                                {selectedSeats.map((seatId) => (
                                    <Badge key={seatId} variant="secondary">
                                        {seatId}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground italic">
                                Chưa chọn ghế ({passengers} ghế cần chọn)
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Price Breakdown */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Giá vé/ghế</span>
                            <span>{formatPrice(trip.price)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Số ghế</span>
                            <span>{selectedSeats.length > 0 ? selectedSeats.length : passengers}</span>
                        </div>
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Tổng tiền</span>
                        <span className="text-2xl font-bold text-primary">
                            {formatPrice(displayPrice)}
                        </span>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-2 text-sm p-3 bg-green-500/10 rounded-lg">
                        <Users className="size-4 text-green-600" />
                        <span className="text-green-700">
                            Còn {trip.availableSeats} ghế trống
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
