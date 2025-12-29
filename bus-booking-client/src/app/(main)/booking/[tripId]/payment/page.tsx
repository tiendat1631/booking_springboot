import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format, differenceInMinutes } from "date-fns";
import { vi } from "date-fns/locale";
import { MapPin, Clock, Bus, Timer } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getBookingForPayment } from "@/data/booking.data";
import { PaymentMethods } from "./_components/payment-methods";

export const metadata: Metadata = {
    title: "Payment - BusGo",
    description: "Complete your payment",
};

interface PaymentPageProps {
    params: Promise<{ tripId: string }>;
    searchParams: Promise<{ bookingId?: string }>;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

function formatDuration(departureTime: string, arrivalTime: string): string {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const minutes = differenceInMinutes(arrival, departure);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}m` : `${hours}h`;
}

export default async function PaymentPage({ params, searchParams }: PaymentPageProps) {
    const { tripId } = await params;
    const { bookingId } = await searchParams;

    if (!bookingId) {
        notFound();
    }

    const booking = await getBookingForPayment(bookingId);

    if (!booking) {
        notFound();
    }

    const departureTime = new Date(booking.trip.departureTime);
    const arrivalTime = new Date(booking.trip.arrivalTime);
    const expiryTime = new Date(booking.expiryTime);
    const now = new Date();
    const timeRemaining = Math.max(0, Math.floor((expiryTime.getTime() - now.getTime()) / 1000 / 60));
    const duration = formatDuration(booking.trip.departureTime, booking.trip.arrivalTime);

    return (
        <div className="container px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">Complete Your Payment</h1>
                    <p className="text-muted-foreground">
                        Review your booking and choose a payment method
                    </p>
                </div>

                {/* Timer Warning */}
                {booking.status === "PENDING" && timeRemaining > 0 && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
                        <Timer className="size-5 text-yellow-600" />
                        <div>
                            <p className="font-medium text-yellow-800">
                                Complete payment within {timeRemaining} minutes
                            </p>
                            <p className="text-sm text-yellow-700">
                                Your booking will be cancelled if not paid by {format(expiryTime, "HH:mm")}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Left: Booking Summary */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Trip Details */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Trip Details</CardTitle>
                                    <Badge variant="outline">{booking.bookingCode}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Route Info */}
                                <div className="flex items-start gap-4">
                                    <div className="text-center min-w-[70px]">
                                        <div className="text-xl font-bold">
                                            {format(departureTime, "HH:mm")}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {format(departureTime, "dd/MM", { locale: vi })}
                                        </div>
                                    </div>

                                    <div className="flex-1 pt-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="size-2 rounded-full bg-primary" />
                                            <div className="flex-1 h-px bg-border" />
                                            <div className="px-2 py-0.5 rounded bg-muted text-xs flex items-center gap-1">
                                                <Clock className="size-3" />
                                                {duration}
                                            </div>
                                            <div className="flex-1 h-px bg-border" />
                                            <div className="size-2 rounded-full bg-primary" />
                                        </div>
                                        
                                        <div className="flex justify-between text-sm">
                                            <div className="flex items-start gap-1.5">
                                                <MapPin className="size-3.5 text-primary mt-0.5" />
                                                <span className="font-medium">{booking.trip.departureStation}</span>
                                            </div>
                                            <div className="flex items-start gap-1.5">
                                                <span className="font-medium">{booking.trip.arrivalStation}</span>
                                                <MapPin className="size-3.5 text-primary mt-0.5" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center min-w-[70px]">
                                        <div className="text-xl font-bold">
                                            {format(arrivalTime, "HH:mm")}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {format(arrivalTime, "dd/MM", { locale: vi })}
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Bus & Seats Info */}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Bus className="size-4 text-muted-foreground" />
                                        <span>{booking.trip.busType}</span>
                                        <span className="text-muted-foreground">•</span>
                                        <span className="font-mono text-muted-foreground">
                                            {booking.trip.busLicensePlate}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">Seats:</span>
                                        <div className="flex gap-1">
                                            {booking.seats.map((seat) => (
                                                <Badge key={seat.seatId} variant="secondary" className="text-xs">
                                                    {seat.seatId}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Passenger Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Passenger Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="text-muted-foreground mb-1">Full Name</div>
                                        <div className="font-medium">{booking.passenger.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground mb-1">Phone</div>
                                        <div className="font-medium">{booking.passenger.phone}</div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <div className="text-muted-foreground mb-1">Email</div>
                                        <div className="font-medium">{booking.passenger.email}</div>
                                    </div>
                                    {booking.notes && (
                                        <div className="sm:col-span-2">
                                            <div className="text-muted-foreground mb-1">Notes</div>
                                            <div className="font-medium">{booking.notes}</div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Payment Section */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-24 space-y-6">
                            {/* Order Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {booking.seats.length} seat(s)
                                        </span>
                                        <span>{formatPrice(booking.totalAmount)}</span>
                                    </div>
                                    {booking.discountAmount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Discount</span>
                                            <span>-{formatPrice(booking.discountAmount)}</span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Total</span>
                                        <span className="text-2xl font-bold text-primary">
                                            {formatPrice(booking.finalAmount)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Methods */}
                            <PaymentMethods 
                                bookingId={booking.bookingId} 
                                totalAmount={booking.finalAmount}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
