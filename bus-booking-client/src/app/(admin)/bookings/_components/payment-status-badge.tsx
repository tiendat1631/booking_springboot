"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, DollarSign, XCircle, RefreshCw } from "lucide-react";
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
import type { PaymentStatus } from "@/types";
import { confirmCashPaymentAction } from "../_actions/confirm-cash-payment";

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
    PAID: { label: "Đã thanh toán", variant: "default" },
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
            const result = await confirmCashPaymentAction(bookingId);

            if (!result.success) {
                throw new Error(result.error);
            }

            alert(`✅ Đã xác nhận thanh toán cho booking ${bookingCode}`);
            router.refresh();
        } catch (error) {
            console.error("Error confirming payment:", error);
            alert(`❌ Lỗi: ${error instanceof Error ? error.message : "Không thể xác nhận thanh toán"}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleStatusAction = (action: string) => {
        if (action === "CONFIRM") {
            setShowConfirmDialog(true);
        } else if (action === "REFUND") {
            alert("⚠️ Chức năng hoàn tiền đang được phát triển");
        } else if (action === "FAIL") {
            alert("⚠️ Chức năng đánh dấu thất bại đang được phát triển");
        }
    };

    const config = statusConfig[currentStatus] || {
        label: currentStatus || "N/A",
        variant: "outline" as const
    };

    // Only show actions for PENDING status
    const showActions = currentStatus === "PENDING";

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={isUpdating || !showActions}>
                    <Badge
                        variant={config.variant}
                        className={showActions ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
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
                {showActions && (
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStatusAction("CONFIRM")}>
                            <Check className="mr-2 h-4 w-4 text-green-600" />
                            Xác nhận thanh toán
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusAction("REFUND")}>
                            <RefreshCw className="mr-2 h-4 w-4 text-blue-600" />
                            Hoàn tiền
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusAction("FAIL")}>
                            <XCircle className="mr-2 h-4 w-4 text-red-600" />
                            Đánh dấu thất bại
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                )}
            </DropdownMenu>

            {/* Confirm Payment Dialog */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận thanh toán?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn đã nhận thanh toán cho booking{" "}
                            <span className="font-mono font-semibold">{bookingCode}</span>?
                            <br />
                            <br />
                            Hành động này sẽ:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Xác nhận thanh toán</li>
                                <li>Cập nhật trạng thái booking thành "Đã xác nhận"</li>
                                <li>Gửi email xác nhận cho khách hàng</li>
                            </ul>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmPayment}>
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
