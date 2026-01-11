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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { confirmCashPayment } from "@/actions/payment.action";
import { toast } from "sonner";
import { PaymentStatus } from "@/schemas/payment.schema";

interface PaymentStatusBadgeProps {
    bookingId: string;
    bookingCode: string;
    currentStatus: PaymentStatus;
    paymentMethod?: string;
}

const statusConfig: Record<PaymentStatus, {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
}> = {
    PENDING: { label: "Chưa thanh toán", variant: "secondary" },
    COMPLETED: { label: "Đã thanh toán", variant: "default" },
    REFUNDED: { label: "Đã hoàn tiền", variant: "outline" },
    FAILED: { label: "Thất bại", variant: "destructive" },
};

export function PaymentStatusBadge({
    bookingId,
    bookingCode,
    currentStatus,
    paymentMethod
}: PaymentStatusBadgeProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const router = useRouter();

    const handleConfirmPayment = async () => {
        setIsUpdating(true);
        setShowConfirmDialog(false);

        try {
            const result = await confirmCashPayment(bookingId);

            if (!result.success) {
                throw new Error(result.error);
            }

            toast.success(`Đã xác nhận thanh toán cho booking ${bookingCode}`);
            router.refresh();
        } catch (error) {
            console.error("Error confirming payment:", error);
            toast.error(`Lỗi: ${error instanceof Error ? error.message : "Không thể xác nhận thanh toán"}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const config = statusConfig[currentStatus] || {
        label: currentStatus || "N/A",
        variant: "outline" as const
    };

    // Only show confirm action for CASH + PENDING payments
    const canConfirmPayment = currentStatus === "PENDING" && paymentMethod === "CASH";

    // If no actions available, just show badge
    if (!canConfirmPayment) {
        return (
            <Badge variant={config.variant}>
                {config.label}
            </Badge>
        );
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={isUpdating}>
                    <Badge
                        variant={config.variant}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            config.label
                        )}
                    </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowConfirmDialog(true)}>
                        <Check className="mr-2 h-4 w-4 text-green-600" />
                        Xác nhận đã nhận tiền mặt
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận thanh toán tiền mặt?</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="text-sm text-muted-foreground">
                                Xác nhận đã nhận thanh toán tiền mặt cho booking{" "}
                                <span className="font-mono font-semibold">{bookingCode}</span>?
                                <br /><br />
                                Hành động này sẽ:
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>Cập nhật trạng thái thanh toán thành "Đã thanh toán"</li>
                                    <li>Xác nhận booking</li>
                                    <li>Gửi email xác nhận cho khách hàng</li>
                                </ul>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmPayment}>
                            Xác nhận đã nhận tiền
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
