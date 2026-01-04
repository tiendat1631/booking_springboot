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
import type { Booking, BookingStatus, PaymentStatus } from "@/schemas/booking.schema";
import { ConfirmCashPaymentButton } from "./confirm-cash-payment-button";
import { BookingStatusBadge } from "./booking-status-badge";
import { PaymentStatusBadge } from "./payment-status-badge";

// Status options for filtering
export const bookingStatusOptions = [
    { label: "Chờ xử lý", value: "PENDING", icon: Clock },
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

// Badge variants for statuses
function getBookingStatusBadge(status: BookingStatus) {
    const variants: Record<BookingStatus, "default" | "secondary" | "destructive" | "outline"> = {
        PENDING: "secondary",
        CONFIRMED: "default",
        CANCELLED: "destructive",
        COMPLETED: "outline",
    };
    const labels: Record<BookingStatus, string> = {
        PENDING: "Chờ xử lý",
        CONFIRMED: "Đã xác nhận",
        CANCELLED: "Đã hủy",
        COMPLETED: "Hoàn thành",
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}

function getPaymentStatusBadge(status: PaymentStatus) {
    const variants: Record<PaymentStatus, "default" | "secondary" | "destructive" | "outline"> = {
        PENDING: "secondary",
        COMPLETED: "default",
        REFUNDED: "outline",
        FAILED: "destructive",
    };
    const labels: Record<PaymentStatus, string> = {
        PENDING: "Chưa thanh toán",
        COMPLETED: "Đã thanh toán",
        REFUNDED: "Đã hoàn tiền",
        FAILED: "Thất bại",
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}

// Column definitions for bookings table
export function getBookingsColumns(): ColumnDef<Booking>[] {
    return [
        {
            id: "bookingId",
            accessorKey: "bookingId",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Mã đặt vé" />
            ),
            cell: ({ row }) => {
                const id = row.getValue<string>("bookingId");
                return <span className="font-mono text-sm">{id?.slice(0, 8) || "N/A"}...</span>;
            },
            enableSorting: false,
            enableColumnFilter: false,
        },
        {
            id: "passengerName",
            accessorFn: (row) => row.passenger?.name,
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Khách hàng" />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{row.original.passenger?.name || "N/A"}</span>
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
            id: "seats",
            accessorFn: (row) => row.seats?.map(s => s.seatId),
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
                        {seats.map((seat) => (
                            <Badge key={seat.seatId} variant="outline" className="font-mono">
                                {seat.seatId}
                            </Badge>
                        ))}
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
            cell: ({ row }) => {
                const booking = row.original;
                return (
                    <BookingStatusBadge
                        bookingId={booking.bookingId}
                        currentStatus={booking.status}
                    />
                );
            },
            meta: {
                label: "Trạng thái đặt vé",
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
                label: "Trạng thái thanh toán",
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
            meta: {
                label: "Tổng tiền",
                variant: "range" as const,
                range: [0, 5000000] as [number, number],
                unit: "đ",
                icon: DollarSign,
            },
            enableColumnFilter: false,
        },
        {
            id: "bookingTime",
            accessorKey: "bookingTime",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Ngày đặt" />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(row.getValue<string>("bookingTime"))}</span>
                </div>
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
                                onClick={() => navigator.clipboard.writeText(booking.bookingId)}
                            >
                                Sao chép mã đặt vé
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            {/* Show confirm payment for CASH + PENDING bookings */}
                            {booking.payment?.method === "CASH" &&
                                booking.payment?.status === "PENDING" &&
                                booking.status === "PENDING" && (
                                    <>
                                        <ConfirmCashPaymentButton
                                            bookingId={booking.bookingId}
                                            bookingCode={booking.bookingCode || booking.bookingId?.slice(0, 8) || "N/A"}
                                        />
                                        <DropdownMenuSeparator />
                                    </>
                                )}

                            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
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
