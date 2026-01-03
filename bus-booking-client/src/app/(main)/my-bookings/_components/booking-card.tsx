import type { BookingResponse } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Calendar, MapPin, CreditCard, Users } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface BookingCardProps {
    booking: BookingResponse;
    onViewDetails: () => void;
}

const statusColors = {
    PENDING: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    CONFIRMED: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    CANCELLED: "bg-red-500/10 text-red-700 border-red-500/20",
    COMPLETED: "bg-green-500/10 text-green-700 border-green-500/20",
} as const;

const paymentStatusColors = {
    PENDING: "bg-orange-500/10 text-orange-700 border-orange-500/20",
    PAID: "bg-green-500/10 text-green-700 border-green-500/20",
    REFUNDED: "bg-gray-500/10 text-gray-700 border-gray-500/20",
    FAILED: "bg-red-500/10 text-red-700 border-red-500/20",
} as const;

export function BookingCard({ booking, onViewDetails }: BookingCardProps) {
    const departureDate = new Date(booking.trip.departureTime);
    const arrivalDate = new Date(booking.trip.arrivalTime);

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">
                            {booking.trip.routeName}
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Mã đặt vé: <span className="font-mono font-semibold">{booking.bookingCode}</span>
                        </CardDescription>
                    </div>
                    <Badge
                        variant="outline"
                        className={statusColors[booking.status as keyof typeof statusColors]}
                    >
                        {booking.status}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 pb-3">
                {/* Route Info */}
                <div className="flex items-start gap-2 text-sm">
                    <MapPin className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div className="space-y-1 min-w-0">
                        <div className="font-medium truncate">
                            {booking.trip.departureStation}
                        </div>
                        <div className="text-muted-foreground truncate">
                            {booking.trip.arrivalStation}
                        </div>
                    </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-start gap-2 text-sm">
                    <Calendar className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div className="space-y-1">
                        <div className="font-medium">
                            {format(departureDate, "dd/MM/yyyy", { locale: vi })}
                        </div>
                        <div className="text-muted-foreground">
                            {format(departureDate, "HH:mm", { locale: vi })} -{" "}
                            {format(arrivalDate, "HH:mm", { locale: vi })}
                        </div>
                    </div>
                </div>

                {/* Seats */}
                <div className="flex items-center gap-2 text-sm">
                    <Users className="size-4 text-muted-foreground shrink-0" />
                    <div>
                        <span className="font-medium">Ghế:</span>{" "}
                        {booking.seats.map((s) => s.seatId).join(", ")}
                    </div>
                </div>

                {/* Payment Status */}
                <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="size-4 text-muted-foreground shrink-0" />
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Thanh toán:</span>
                        <Badge
                            variant="outline"
                            className={`text-xs ${paymentStatusColors[booking.payment?.status as keyof typeof paymentStatusColors] || "bg-gray-500/10 text-gray-700"}`}
                        >
                            {booking.payment?.status || "PENDING"}
                        </Badge>
                    </div>
                </div>

                {/* Price */}
                <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tổng tiền:</span>
                        <span className="text-lg font-bold text-primary">
                            {booking.finalAmount.toLocaleString("vi-VN")} ₫
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-3 border-t bg-muted/30">
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={onViewDetails}
                >
                    Xem chi tiết
                </Button>
            </CardFooter>
        </Card>
    );
}
