"use client";

import { CheckCircle, MapPin, Clock, Copy, Check } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CashPaymentSuccessDialogProps {
    open: boolean;
    onClose: () => void;
    bookingCode: string;
}

export function CashPaymentSuccessDialog({
    open,
    onClose,
    bookingCode,
}: CashPaymentSuccessDialogProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyBookingCode = () => {
        navigator.clipboard.writeText(bookingCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-green-100 p-3">
                            <CheckCircle className="size-8 text-green-600" />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-xl">
                        Booking Created Successfully!
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Please complete your payment at our counter before departure
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Booking Code */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Your Booking Code
                                </p>
                                <div className="flex items-center justify-center gap-2">
                                    <code className="text-2xl font-bold font-mono">
                                        {bookingCode}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCopyBookingCode}
                                    >
                                        {copied ? (
                                            <Check className="size-4 text-green-600" />
                                        ) : (
                                            <Copy className="size-4" />
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Please bring this code when paying
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Locations */}
                    <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                            <MapPin className="size-4" />
                            Payment Locations
                        </h4>
                        <div className="space-y-2">
                            <Card>
                                <CardContent className="p-3">
                                    <p className="font-medium">Main Bus Station</p>
                                    <p className="text-sm text-muted-foreground">
                                        Counter 1-3, Ground Floor
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-3">
                                    <p className="font-medium">Head Office</p>
                                    <p className="text-sm text-muted-foreground">
                                        123 Main Street, District 1
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Important Note */}
                    <Card className="border-amber-200 bg-amber-50">
                        <CardContent className="p-3">
                            <div className="flex gap-2">
                                <Clock className="size-4 text-amber-600 mt-0.5 flex-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-amber-900">
                                        Payment Deadline
                                    </p>
                                    <p className="text-amber-700">
                                        Please pay at least 2 hours before departure
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Button onClick={onClose} className="w-full" size="lg">
                    View My Bookings
                </Button>
            </DialogContent>
        </Dialog>
    );
}
