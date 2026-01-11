"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
    Ticket,
    Calendar,
    DollarSign,
    User,
    CheckCircle,
    XCircle,
    Clock,
    MoreHorizontal,
    MapPin,
} from "lucide-react";
import * as React from "react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/format";
import type { Booking, PaymentStatus } from "@/schemas/booking.schema";
import { ConfirmCashPaymentButton } from "./confirm-cash-payment-button";
import { BookingStatusBadge } from "./booking-status-badge";
import { PaymentStatusBadge } from "./payment-status-badge";

// Status options for filtering
export const bookingStatusOptions = [
    { label: "Chờ thanh toán", value: "PENDING", icon: Clock },
    { label: "Đã xác nhận", value: "CONFIRMED", icon: CheckCircle },
    { label: "Đã hủy", value: "CANCELLED", icon: XCircle },
    { label: "Hoàn thành", value: "COMPLETED", icon: CheckCircle },
];

export const paymentStatusOptions = [
    { label: "Chưa thanh toán", value: "PENDING", icon: Clock },
    { label: "Đã thanh toán", value: "COMPLETED", icon: CheckCircle },
    { label: "Đã hoàn tiền", value: "REFUNDED", icon: DollarSign },
    { label: "Thất bại", value: "FAILED", icon: XCircle },
];

// Column definitions for bookings table
export function getBookingsColumns(): ColumnDef<Booking>[] {
    return [
        {
            id: "bookingCode",
            accessorKey: "bookingCode",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Mã đặt vé" />
            ),
            cell: ({ row }) => {
                const code = row.getValue<string>("bookingCode");
                return (
                    <span className="font-mono text-sm font-medium">
                        {code || "N/A"}
                    </span>
                );
            },
            meta: {
                label: "Mã đặt vé",
                placeholder: "Tìm theo mã...",
                variant: "text" as const,
                icon: Ticket,
            },
            enableColumnFilter: true,
        },
        {
            id: "passengerName",
            accessorFn: (row) => row.passenger?.name,
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Khách hàng" />
            ),
            cell: ({ row }) => (
                <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{row.original.passenger?.name || "N/A"}</span>
                    <span className="text-xs text-muted-foreground">
                        {row.original.passenger?.phone}
                    </span>
                </div>
            ),
            meta: {
                label: "Khách hàng",
                placeholder: "Tìm theo tên...",
                variant: "text" as const,
                icon: User,
            },
            enableColumnFilter: true,
        },
        {
            id: "tripInfo",
            accessorFn: (row) => row.trip?.routeName,
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Chuyến" />
            ),
            cell: ({ row }) => {
                const trip = row.original.trip;
                if (!trip) {
                    return <span className="text-muted-foreground">N/A</span>;
                }
                return (
                    <div className="flex flex-col gap-0.5 max-w-[200px]">
                        <span className="font-medium truncate" title={trip.routeName}>
                            {trip.routeName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {formatDate(trip.departureTime)}
                        </span>
                    </div>
                );
            },
            enableSorting: false,
            enableColumnFilter: false,
        },
        {
            id: "seats",
            accessorFn: (row) => row.seats?.map(s => s.seatId).join(", "),
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Ghế" />
            ),
            cell: ({ row }) => {
                const seats = row.original.seats;
                if (!seats || seats.length === 0) {
                    return <span className="text-muted-foreground text-sm">N/A</span>;
                }
                return (
                    <div className="flex flex-wrap gap-1">
                        {seats.slice(0, 3).map((seat) => (
                            <Badge key={seat.seatId} variant="outline" className="font-mono text-xs">
                                {seat.seatId}
                            </Badge>
                        ))}
                        {seats.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{seats.length - 3}
                            </Badge>
                        )}
                    </div>
                );
            },
            enableSorting: false,
            enableColumnFilter: false,
        },
        {
            id: "status",
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Trạng thái" />
            ),
            cell: ({ row }) => (
                <BookingStatusBadge currentStatus={row.original.status} />
            ),
            meta: {
                label: "Trạng thái",
                variant: "select" as const,
                options: bookingStatusOptions,
                icon: Ticket,
            },
            enableColumnFilter: true,
        },
        {
            id: "paymentStatus",
            accessorFn: (row) => row.payment?.status,
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Thanh toán" />
            ),
            cell: ({ row }) => {
                const booking = row.original;
                return (
                    <PaymentStatusBadge
                        bookingId={booking.bookingId}
                        bookingCode={booking.bookingCode}
                        currentStatus={(booking.payment?.status as PaymentStatus) || "PENDING"}
                        paymentMethod={booking.payment?.method}
                    />
                );
            },
            meta: {
                label: "Thanh toán",
                variant: "select" as const,
                options: paymentStatusOptions,
                icon: DollarSign,
            },
            enableColumnFilter: true,
        },
        {
            id: "finalAmount",
            accessorKey: "finalAmount",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Tổng tiền" />
            ),
            cell: ({ row }) => (
                <span className="font-medium">
                    {formatCurrency(row.getValue<number>("finalAmount"))}
                </span>
            ),
            enableColumnFilter: false,
        },
        {
            id: "bookingTime",
            accessorKey: "bookingTime",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Ngày đặt" />
            ),
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {formatDate(row.getValue<string>("bookingTime"))}
                </span>
            ),
            meta: {
                label: "Ngày đặt",
                variant: "dateRange" as const,
                icon: Calendar,
            },
            enableColumnFilter: true,
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const booking = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Mở menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(booking.bookingCode)}
                            >
                                Sao chép mã booking
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            {/* Show confirm payment for CASH + PENDING bookings */}
                            {booking.payment?.method === "CASH" &&
                                booking.payment?.status === "PENDING" && (
                                    <>
                                        <ConfirmCashPaymentButton
                                            bookingId={booking.bookingId}
                                            bookingCode={booking.bookingCode || "N/A"}
                                        />
                                        <DropdownMenuSeparator />
                                    </>
                                )}

                            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>

                            {/* Only allow cancel for CONFIRMED bookings */}
                            {booking.status === "CONFIRMED" && (
                                <DropdownMenuItem className="text-destructive">
                                    Hủy đặt vé
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            enableSorting: false,
            enableColumnFilter: false,
        },
    ];
}
