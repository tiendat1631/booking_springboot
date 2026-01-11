"use client";

import type { Booking } from "@/schemas/booking.schema";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    MapPin,
    User,
    Phone,
    Mail,
    CreditCard,
    Bus,
    Armchair,
    Clock,
    Download,
    X,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface BookingDetailsDialogProps {
    booking: Booking | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
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

export function BookingDetailsDialog({
    booking,
    open,
    onOpenChange,
}: BookingDetailsDialogProps) {
    if (!booking) return null;

    const departureDate = new Date(booking.trip.departureTime);
    const arrivalDate = new Date(booking.trip.arrivalTime);
    const bookingDate = new Date(booking.bookingTime);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl">
                                Chi tiết đặt vé
                            </DialogTitle>
                            <DialogDescription>
                                Mã đặt vé:{" "}
                                <span className="font-mono font-semibold text-foreground">
                                    {booking.bookingCode}
                                </span>
                            </DialogDescription>
                        </div>
                        <Badge
                            variant="outline"
                            className={statusColors[booking.status as keyof typeof statusColors]}
                        >
                            {booking.status}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Trip Information */}
                    <section className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Bus className="size-5" />
                            Thông tin chuyến xe
                        </h3>
                        <div className="space-y-3 pl-7">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">
                                        Tuyến đường
                                    </div>
                                    <div className="font-medium">
                                        {booking.trip.routeName}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">
                                        Biển số xe
                                    </div>
                                    <div className="font-medium font-mono">
                                        {booking.trip.busLicensePlate}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <MapPin className="size-4 mt-1 text-muted-foreground shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <div>
                                        <div className="text-sm text-muted-foreground">
                                            Điểm đi
                                        </div>
                                        <div className="font-medium">
                                            {booking.trip.departureStation}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">
                                            Điểm đến
                                        </div>
                                        <div className="font-medium">
                                            {booking.trip.arrivalStation}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <Calendar className="size-4 mt-1 text-muted-foreground shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <div>
                                        <div className="text-sm text-muted-foreground">
                                            Khởi hành
                                        </div>
                                        <div className="font-medium">
                                            {format(departureDate, "HH:mm - dd/MM/yyyy", {
                                                locale: vi,
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">
                                            Đến nơi (dự kiến)
                                        </div>
                                        <div className="font-medium">
                                            {format(arrivalDate, "HH:mm - dd/MM/yyyy", {
                                                locale: vi,
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Passenger Information */}
                    <section className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <User className="size-5" />
                            Thông tin hành khách
                        </h3>
                        <div className="space-y-2 pl-7">
                            <div className="flex items-center gap-2">
                                <User className="size-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Họ tên:
                                </span>
                                <span className="font-medium">
                                    {booking.passenger.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="size-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Số điện thoại:
                                </span>
                                <span className="font-medium font-mono">
                                    {booking.passenger.phone}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="size-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Email:
                                </span>
                                <span className="font-medium">
                                    {booking.passenger.email}
                                </span>
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Seat Information */}
                    <section className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Armchair className="size-5" />
                            Thông tin ghế
                        </h3>
                        <div className="pl-7">
                            <div className="flex flex-wrap gap-2">
                                {booking.seats.map((seat) => (
                                    <Badge
                                        key={seat.seatId}
                                        variant="secondary"
                                        className="text-sm px-3 py-1"
                                    >
                                        Ghế {seat.seatId} -{" "}
                                        {seat.price.toLocaleString("vi-VN")} ₫
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Payment Information */}
                    <section className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <CreditCard className="size-5" />
                            Thông tin thanh toán
                        </h3>
                        <div className="space-y-3 pl-7">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Tổng tiền vé:
                                    </span>
                                    <span className="font-medium">
                                        {booking.totalAmount.toLocaleString("vi-VN")} ₫
                                    </span>
                                </div>
                                {booking.discountAmount > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Giảm giá:
                                        </span>
                                        <span className="font-medium text-green-600">
                                            -{booking.discountAmount.toLocaleString("vi-VN")} ₫
                                        </span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex items-center justify-between text-lg">
                                    <span className="font-semibold">Thành tiền:</span>
                                    <span className="font-bold text-primary">
                                        {booking.finalAmount.toLocaleString("vi-VN")} ₫
                                    </span>
                                </div>
                            </div>

                            {booking.payment && (
                                <div className="space-y-2 pt-2 border-t">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Trạng thái:
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={
                                                paymentStatusColors[
                                                booking.payment.status as keyof typeof paymentStatusColors
                                                ]
                                            }
                                        >
                                            {booking.payment.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Phương thức:
                                        </span>
                                        <span className="font-medium">
                                            {booking.payment.method}
                                        </span>
                                    </div>
                                    {booking.payment.paidAt && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Thời gian thanh toán:
                                            </span>
                                            <span className="font-medium">
                                                {format(
                                                    new Date(booking.payment.paidAt),
                                                    "HH:mm - dd/MM/yyyy",
                                                    { locale: vi }
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    <Separator />

                    {/* Booking Timeline */}
                    <section className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Clock className="size-5" />
                            Thời gian đặt vé
                        </h3>
                        <div className="pl-7">
                            <div className="text-sm text-muted-foreground">
                                Đặt lúc:{" "}
                                <span className="font-medium text-foreground">
                                    {format(bookingDate, "HH:mm - dd/MM/yyyy", {
                                        locale: vi,
                                    })}
                                </span>
                            </div>
                        </div>
                    </section>

                    {booking.notes && (
                        <>
                            <Separator />
                            <section className="space-y-3">
                                <h3 className="font-semibold text-lg">Ghi chú</h3>
                                <div className="pl-7">
                                    <p className="text-sm text-muted-foreground">
                                        {booking.notes}
                                    </p>
                                </div>
                            </section>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" className="flex-1" disabled>
                        <Download className="size-4 mr-2" />
                        Tải vé
                    </Button>
                    {booking.status === "CONFIRMED" && (
                        <Button variant="destructive" className="flex-1" disabled>
                            <X className="size-4 mr-2" />
                            Hủy vé
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
