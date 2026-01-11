"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Wallet, Building2 } from "lucide-react";

import { initiatePayment } from "@/actions/payment.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PaymentMethod } from "@/schemas/payment.schema";
import { CashPaymentSuccessDialog } from "./cash-payment-success-dialog";
import { Spinner } from "@/components/ui/spinner";

interface PaymentMethodsProps {
    bookingId: string;
    totalAmount: number;
}

const paymentMethods: {
    id: PaymentMethod;
    name: string;
    description: string;
    icon: typeof CreditCard;
    disabled?: boolean;
}[] = [
    {
        id: "VNPAY",
        name: "VNPay",
        description: "Pay with VNPay QR, ATM, or Credit Card",
        icon: CreditCard,
    },
    {
        id: "MOMO",
        name: "MoMo",
        description: "Pay with MoMo e-wallet",
        icon: Wallet,
        disabled: true,
    },
    {
        id: "CASH",
        name: "Cash",
        description: "Pay with cash",
        icon: Building2,
    },
];

export function PaymentMethods({ bookingId, totalAmount }: PaymentMethodsProps) {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("VNPAY");
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCashDialog, setShowCashDialog] = useState(false);
    const [cashBookingCode, setCashBookingCode] = useState("");

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const returnUrl = selectedMethod === "VNPAY" 
                ? `${window.location.origin}/payment/vnpay-return` 
                : undefined;

            const result = await initiatePayment({
                bookingId,
                method: selectedMethod,
                returnUrl,
            });

            if (!result.success) {
                throw new Error(result.error);
            }

            // Handle Cash Payment - show success dialog
            if (selectedMethod === "CASH") {
                setCashBookingCode(result.data?.bookingCode || bookingId);
                setShowCashDialog(true);
                return;
            }

            // Handle VNPay Payment - redirect to payment URL
            if (selectedMethod === "VNPAY" && result.data?.paymentUrl) {
                window.location.href = result.data.paymentUrl;
                return;
            }

            // Fallback - navigate to confirmation
            router.push(`/booking/confirmation/${bookingId}`);
        } catch (error) {
            console.error("Payment error:", error);
            alert(error instanceof Error ? error.message : "Failed to process payment. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <RadioGroup
                    value={selectedMethod}
                    onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}
                    className="space-y-3"
                >
                    {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                            <div key={method.id}>
                                <Label
                                    htmlFor={method.id}
                                    className={cn(
                                        "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors",
                                        selectedMethod === method.id
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/50",
                                        method.disabled && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <RadioGroupItem
                                        value={method.id}
                                        id={method.id}
                                        disabled={method.disabled}
                                    />
                                    <Icon className="size-6 text-muted-foreground" />
                                    <div className="flex-1">
                                        <div className="font-medium flex items-center gap-2">
                                            {method.name}
                                            {method.disabled && (
                                                <span className="text-xs text-muted-foreground">(Coming soon)</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {method.description}
                                        </div>
                                    </div>
                                </Label>
                            </div>
                        );
                    })}
                </RadioGroup>

                <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                >
                    {isProcessing ? (
                        <>
                            <Spinner />
                            Processing...
                        </>
                    ) : (
                        "Pay Now"
                    )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    By clicking "Pay Now", you agree to our Terms of Service and Privacy Policy
                </p>
            </CardContent>

            {/* Cash Payment Success Dialog */}
            <CashPaymentSuccessDialog
                open={showCashDialog}
                onClose={() => {
                    setShowCashDialog(false);
                    router.push("/my-bookings");
                }}
                bookingCode={cashBookingCode}
            />
        </Card>
    );
}
