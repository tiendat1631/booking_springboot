"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Wallet, Loader2, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PaymentMethodsProps {
    bookingId: string;
    totalAmount: number;
}

const paymentMethods = [
    {
        id: "vnpay",
        name: "VNPay",
        description: "Pay with VNPay QR, ATM, or Credit Card",
        icon: CreditCard,
    },
    {
        id: "momo",
        name: "MoMo",
        description: "Pay with MoMo e-wallet",
        icon: Wallet,
        disabled: true,
    },
    {
        id: "bank_transfer",
        name: "Bank Transfer",
        description: "Direct bank transfer",
        icon: Building2,
        disabled: true,
    },
];

export function PaymentMethods({ bookingId, totalAmount }: PaymentMethodsProps) {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState("vnpay");
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            // TODO: Call payment API based on selected method
            if (selectedMethod === "vnpay") {
                // Call VNPay API to get payment URL
                const response = await fetch(`/api/payment/vnpay/create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bookingId, amount: totalAmount }),
                });

                const data = await response.json();
                if (data.paymentUrl) {
                    window.location.href = data.paymentUrl;
                    return;
                }
            }

            // Fallback - navigate to confirmation
            router.push(`/booking/confirmation/${bookingId}`);
        } catch (error) {
            console.error("Payment error:", error);
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
                    onValueChange={setSelectedMethod}
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
                            <Loader2 className="mr-2 size-4 animate-spin" />
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
        </Card>
    );
}
