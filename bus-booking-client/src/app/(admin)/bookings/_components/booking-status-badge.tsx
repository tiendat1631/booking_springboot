"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { BookingStatus } from "@/schemas/booking.schema";

interface BookingStatusBadgeProps {
    bookingId: string;
    currentStatus: BookingStatus;
}

const statusConfig: Record<BookingStatus, {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
}> = {
    PENDING: { label: "Chờ xử lý", variant: "secondary" },
    CONFIRMED: { label: "Đã xác nhận", variant: "default" },
    CANCELLED: { label: "Đã hủy", variant: "destructive" },
    COMPLETED: { label: "Hoàn thành", variant: "outline" },
};

const allStatuses: BookingStatus[] = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

export function BookingStatusBadge({ bookingId, currentStatus }: BookingStatusBadgeProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    const handleStatusChange = async (newStatus: BookingStatus) => {
        if (newStatus === currentStatus) return;

        setIsUpdating(true);
        try {
            const response = await fetch(`/api/bookings/admin/${bookingId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error("Failed to update status");
            }

            toast.success(`Đã cập nhật trạng thái thành "${statusConfig[newStatus].label}"`);
            router.refresh();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Lỗi: Không thể cập nhật trạng thái");
        } finally {
            setIsUpdating(false);
        }
    };

    // Fallback for undefined or invalid status
    const config = statusConfig[currentStatus] || {
        label: currentStatus || "N/A",
        variant: "outline" as const
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isUpdating}>
                <Badge
                    variant={config.variant}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                    {isUpdating ? (
                        <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Đang cập nhật...
                        </>
                    ) : (
                        config.label
                    )}
                </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {allStatuses.map((status) => (
                    <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        disabled={status === currentStatus}
                    >
                        {status === currentStatus && (
                            <Check className="mr-2 h-4 w-4" />
                        )}
                        <span className={status === currentStatus ? "font-semibold" : ""}>
                            {statusConfig[status].label}
                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
