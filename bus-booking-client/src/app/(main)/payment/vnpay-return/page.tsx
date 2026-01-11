import { Metadata } from "next";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { processVNPayCallback } from "@/actions/payment.action";

export const metadata: Metadata = {
    title: "Payment Result - BusGo",
    description: "VNPay payment result",
};

interface VNPayReturnPageProps {
    searchParams: Promise<{
        vnp_TxnRef?: string;
        vnp_ResponseCode?: string;
        vnp_TransactionNo?: string;
        vnp_OrderInfo?: string;
        vnp_Amount?: string;
        vnp_BankCode?: string;
        vnp_PayDate?: string;
        vnp_SecureHash?: string;
        [key: string]: string | undefined;
    }>;
}

export default async function VNPayReturnPage({ searchParams }: VNPayReturnPageProps) {
    const params = await searchParams;

    // Validate required params
    if (!params.vnp_TxnRef || !params.vnp_ResponseCode) {
        return (
            <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">Invalid Request</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            <AlertCircle className="size-16 text-yellow-500" />
                            <p className="text-center text-muted-foreground">
                                Missing required payment parameters.
                            </p>
                        </div>
                        <Button asChild className="w-full" size="lg">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Process the callback using server action
    const result = await processVNPayCallback(params);

    // Extract booking code from order info
    const bookingCodeMatch = params.vnp_OrderInfo?.match(/BK\d+/);
    const bookingCode = bookingCodeMatch?.[0];

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">
                        {result.success ? "Payment Successful" : "Payment Failed"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        {result.success ? (
                            <CheckCircle className="size-16 text-green-500" />
                        ) : (
                            <XCircle className="size-16 text-red-500" />
                        )}

                        <p className="text-center text-muted-foreground">
                            {result.success
                                ? "Your payment has been processed successfully. Your booking is now confirmed."
                                : result.message}
                        </p>

                        {bookingCode && (
                            <p className="text-sm text-center">
                                Booking Code: <span className="font-mono font-bold">{bookingCode}</span>
                            </p>
                        )}

                        {params.vnp_TransactionNo && result.success && (
                            <p className="text-xs text-muted-foreground text-center">
                                Transaction No: {params.vnp_TransactionNo}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        {result.success ? (
                            <Button asChild className="w-full" size="lg">
                                <Link href="/my-bookings">View My Bookings</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild className="w-full" size="lg">
                                    <Link href="/">Back to Home</Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/search">Search New Trip</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
