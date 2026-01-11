"use client";

import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/schemas/booking.schema";

interface BookingStatusBadgeProps {
    currentStatus: BookingStatus;
}

const statusConfig: Record<BookingStatus, {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
}> = {
    PENDING: { label: "Chờ thanh toán", variant: "secondary" },
    CONFIRMED: { label: "Đã xác nhận", variant: "default" },
    CANCELLED: { label: "Đã hủy", variant: "destructive" },
    COMPLETED: { label: "Hoàn thành", variant: "outline" },
};

/**
 * Simple booking status badge - display only, no actions
 * Status changes should be done through explicit actions in the actions dropdown
 */
export function BookingStatusBadge({ currentStatus }: BookingStatusBadgeProps) {
    const config = statusConfig[currentStatus] || {
        label: currentStatus || "N/A",
        variant: "outline" as const
    };

    return (
        <Badge variant={config.variant}>
            {config.label}
        </Badge>
    );
}
