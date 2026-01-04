"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { confirmCashPayment } from "@/actions/payment.action";
import { toast } from "sonner";

interface ConfirmCashPaymentButtonProps {
    bookingId: string;
    bookingCode: string;
    disabled?: boolean;
}

export function ConfirmCashPaymentButton({
    bookingId,
    bookingCode,
    disabled = false,
}: ConfirmCashPaymentButtonProps) {
    const [open, setOpen] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const router = useRouter();

    const handleConfirm = async () => {
        setIsConfirming(true);
        try {
            const result = await confirmCashPayment(bookingId);

            if (!result.success) {
                throw new Error(result.error);
            }

            // Success notification
            toast.success(`Đã xác nhận thanh toán tiền mặt cho booking ${bookingCode}`);

            // Refresh the page to update table
            router.refresh();
            setOpen(false);
        } catch (error) {
            console.error("Error confirming cash payment:", error);
            toast.error(error instanceof Error ? error.message : "Không thể xác nhận thanh toán");
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(true)}
                disabled={disabled || isConfirming}
                className="w-full justify-start"
            >
                <Check className="mr-2 h-4 w-4" />
                Xác nhận thanh toán
            </Button>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận thanh toán tiền mặt?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn đã nhận tiền mặt cho booking{" "}
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
                        <AlertDialogCancel disabled={isConfirming}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleConfirm();
                            }}
                            disabled={isConfirming}
                        >
                            {isConfirming ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Xác nhận"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
