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
import type { Booking, BookingStatus, PaymentStatus } from "@/types";
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
    { label: "Đã thanh toán", value: "PAID", icon: CheckCircle },
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
        PAID: "default",
        REFUNDED: "outline",
        FAILED: "destructive",
    };
    const labels: Record<PaymentStatus, string> = {
        PENDING: "Chưa thanh toán",
        PAID: "Đã thanh toán",
        REFUNDED: "Đã hoàn tiền",
        FAILED: "Thất bại",
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}

// Column definitions for bookings table
export function getBookingsColumns(): ColumnDef<Booking>[] {
    return [
        {
            id: "id",
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Mã đặt vé" />
            ),
            cell: ({ row }) => {
                const id = row.getValue<string>("id");
                return <span className="font-mono text-sm">{id?.slice(0, 8) || "N/A"}...</span>;
            },
            enableSorting: false,
            enableColumnFilter: false,
        },
        {
            id: "customerName",
            accessorKey: "customerName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Khách hàng" />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{row.getValue<string>("customerName")}</span>
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
            id: "seatNumbers",
            accessorKey: "seatNumbers",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Ghế" />
            ),
            cell: ({ row }) => {
                const seats = row.getValue<string[]>("seatNumbers");
                if (!seats || seats.length === 0) {
                    return <span className="text-muted-foreground text-sm">N/A</span>;
                }
                return (
                    <div className="flex flex-wrap gap-1">
                        {seats.map((seat) => (
                            <Badge key={seat} variant="outline" className="font-mono">
                                {seat}
                            </Badge>
                        ))}
                    </div>
                );
            },
            enableSorting: false,
            enableColumnFilter: false,
        },
        {
            id: "bookingStatus",
            accessorKey: "bookingStatus",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Trạng thái" />
            ),
            cell: ({ row }) => {
                const booking = row.original;
                return (
                    <BookingStatusBadge
                        bookingId={booking.id}
                        currentStatus={booking.bookingStatus}
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
            accessorKey: "paymentStatus",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Thanh toán" />
            ),
            cell: ({ row }) => {
                const booking = row.original;
                return (
                    <PaymentStatusBadge
                        bookingId={booking.id}
                        bookingCode={booking.bookingCode}
                        currentStatus={booking.paymentStatus}
                        paymentMethod={booking.paymentMethod}
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
            id: "totalPrice",
            accessorKey: "totalPrice",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Tổng tiền" />
            ),
            cell: ({ row }) => (
                <span className="font-medium">
                    {formatCurrency(row.getValue<number>("totalPrice"))}
                </span>
            ),
            meta: {
                label: "Tổng tiền",
                variant: "range" as const,
                range: [0, 5000000] as [number, number],
                unit: "đ",
                icon: DollarSign,
            },
            enableColumnFilter: false, // Disable for now, enable if needed
        },
        {
            id: "bookedAt",
            accessorKey: "bookedAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Ngày đặt" />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(row.getValue<string>("bookedAt"))}</span>
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
                                onClick={() => navigator.clipboard.writeText(booking.id)}
                            >
                                Sao chép mã đặt vé
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            {/* Show confirm payment for CASH + PENDING bookings */}
                            {booking.paymentMethod === "CASH" &&
                                booking.paymentStatus === "PENDING" &&
                                booking.bookingStatus === "PENDING" && (
                                    <>
                                        <ConfirmCashPaymentButton
                                            bookingId={booking.id}
                                            bookingCode={booking.bookingCode || booking.id?.slice(0, 8) || "N/A"}
                                        />
                                        <DropdownMenuSeparator />
                                    </>
                                )}

                            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                            {booking.bookingStatus === "CONFIRMED" && (
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
