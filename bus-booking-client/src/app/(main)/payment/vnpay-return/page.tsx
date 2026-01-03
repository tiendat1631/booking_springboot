"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VNPayReturnPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"processing" | "success" | "failed">("processing");
    const [message, setMessage] = useState("Processing payment...");
    const [bookingCode, setBookingCode] = useState<string>("");

    useEffect(() => {
        const processCallback = async () => {
            try {
                // Get all query parameters
                const params = new URLSearchParams(searchParams.toString());

                console.log("VNPay callback params:", Object.fromEntries(params));

                // Extract important params
                const vnpTxnRef = params.get("vnp_TxnRef");
                const vnpResponseCode = params.get("vnp_ResponseCode");
                const vnpTransactionNo = params.get("vnp_TransactionNo");
                const vnpOrderInfo = params.get("vnp_OrderInfo");

                if (!vnpTxnRef || !vnpResponseCode) {
                    throw new Error("Missing required parameters");
                }

                // Extract booking code from order info
                const match = vnpOrderInfo?.match(/BK\d+/);
                if (match) {
                    setBookingCode(match[0]);
                }

                // Call backend to process callback
                const response = await fetch(`/api/payments/vnpay/callback?${params.toString()}`);

                const data = await response.json();
                console.log("Callback response:", data);

                if (response.ok && data.RspCode === "00") {
                    setStatus("success");
                    setMessage("Payment successful! Your booking has been confirmed.");
                } else {
                    setStatus("failed");
                    setMessage(data.Message || "Payment failed. Please try again.");
                }
            } catch (error) {
                console.error("Error processing callback:", error);
                setStatus("failed");
                setMessage("An error occurred while processing your payment.");
            }
        };

        processCallback();
    }, [searchParams]);

    const handleContinue = () => {
        if (status === "success") {
            router.push("/my-bookings");
        } else {
            router.push("/");
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">
                        {status === "processing" && "Processing Payment"}
                        {status === "success" && "Payment Successful"}
                        {status === "failed" && "Payment Failed"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        {status === "processing" && (
                            <Loader2 className="size-16 animate-spin text-primary" />
                        )}
                        {status === "success" && (
                            <CheckCircle className="size-16 text-green-500" />
                        )}
                        {status === "failed" && (
                            <XCircle className="size-16 text-red-500" />
                        )}

                        <p className="text-center text-muted-foreground">
                            {message}
                        </p>

                        {bookingCode && (
                            <p className="text-sm text-center">
                                Booking Code: <span className="font-mono font-bold">{bookingCode}</span>
                            </p>
                        )}
                    </div>

                    {status !== "processing" && (
                        <Button
                            onClick={handleContinue}
                            className="w-full"
                            size="lg"
                        >
                            {status === "success" ? "View Booking Details" : "Back to Home"}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
