"use client";

import { useState, useTransition } from "react";
import { Search, Ticket, MapPin, Clock, User, Phone, Mail, CreditCard, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { lookupBooking, type BookingLookupResult } from "./_actions/lookup-booking";

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    PENDING_PAYMENT: { label: "Chờ thanh toán", variant: "secondary" },
    CONFIRMED: { label: "Đã xác nhận", variant: "default" },
    COMPLETED: { label: "Hoàn thành", variant: "default" },
    CANCELLED: { label: "Đã hủy", variant: "destructive" },
    EXPIRED: { label: "Hết hạn", variant: "outline" },
};

function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

export default function LookupBookingPage() {
    const [bookingCode, setBookingCode] = useState("");
    const [result, setResult] = useState<BookingLookupResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSearch = () => {
        setError(null);
        setResult(null);

        startTransition(async () => {
            const response = await lookupBooking(bookingCode);
            if (response.success && response.data) {
                setResult(response.data);
            } else {
                setError(response.error || "Không tìm thấy booking");
            }
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isPending) {
            handleSearch();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Tra cứu vé</h1>
                <p className="text-muted-foreground">
                    Nhập mã booking để xem thông tin chi tiết vé của bạn
                </p>
            </div>

            {/* Search Form */}
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                            <Input
                                placeholder="Nhập mã booking (VD: BK2025011100001)"
                                value={bookingCode}
                                onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                                onKeyDown={handleKeyDown}
                                className="pl-10 h-12 text-lg uppercase"
                                disabled={isPending}
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            disabled={isPending || !bookingCode.trim()}
                            className="h-12 px-6"
                        >
                            <Search className="size-5 mr-2" />
                            {isPending ? "Đang tìm..." : "Tra cứu"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Booking Result */}
            {result && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">{result.bookingCode}</CardTitle>
                                <CardDescription>
                                    Đặt lúc: {formatDateTime(result.bookingTime)}
                                </CardDescription>
                            </div>
                            <Badge variant={STATUS_MAP[result.status]?.variant || "secondary"}>
                                {STATUS_MAP[result.status]?.label || result.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Trip Info */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <MapPin className="size-4" />
                                Thông tin chuyến
                            </h3>
                            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                <p className="font-medium text-lg">{result.trip.routeName}</p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Điểm đi:</span>{" "}
                                        <span className="font-medium">{result.trip.departureStation}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Điểm đến:</span>{" "}
                                        <span className="font-medium">{result.trip.arrivalStation}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Khởi hành:</span>{" "}
                                        <span className="font-medium">{formatDateTime(result.trip.departureTime)}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Đến nơi:</span>{" "}
                                        <span className="font-medium">{formatDateTime(result.trip.arrivalTime)}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Xe:</span>{" "}
                                        <span className="font-medium">{result.trip.busLicensePlate}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Loại xe:</span>{" "}
                                        <span className="font-medium">{result.trip.busType}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Passenger Info */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <User className="size-4" />
                                Thông tin hành khách
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <User className="size-4 text-muted-foreground" />
                                    <span>{result.passenger.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="size-4 text-muted-foreground" />
                                    <span>{result.passenger.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="size-4 text-muted-foreground" />
                                    <span>{result.passenger.email}</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Seats */}
                        <div>
                            <h3 className="font-semibold mb-3">Ghế đã đặt</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.seats.map((seat) => (
                                    <Badge key={seat.seatId} variant="outline" className="text-sm py-1 px-3">
                                        {seat.seatId}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Payment Info */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <CreditCard className="size-4" />
                                Thanh toán
                            </h3>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="text-muted-foreground">Tổng tiền:</span>
                                    <span>{formatCurrency(result.totalAmount)}</span>
                                </div>
                                {result.discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span className="text-muted-foreground">Giảm giá:</span>
                                        <span className="text-green-600">-{formatCurrency(result.discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center font-semibold text-lg border-t pt-2 mt-2">
                                    <span>Thành tiền:</span>
                                    <span className="text-primary">{formatCurrency(result.finalAmount)}</span>
                                </div>

                                {result.payment && (
                                    <div className="mt-4 pt-4 border-t text-sm space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Phương thức:</span>
                                            <span>{result.payment.method}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Trạng thái:</span>
                                            <Badge variant={result.payment.status === "COMPLETED" ? "default" : "secondary"}>
                                                {result.payment.status === "COMPLETED" ? "Đã thanh toán" : result.payment.status}
                                            </Badge>
                                        </div>
                                        {result.payment.paidAt && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Thanh toán lúc:</span>
                                                <span>{formatDateTime(result.payment.paidAt)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Expiry Warning */}
                        {result.status === "PENDING_PAYMENT" && result.expiryTime && (
                            <Alert>
                                <Clock className="size-4" />
                                <AlertDescription>
                                    Vé sẽ hết hạn vào <strong>{formatDateTime(result.expiryTime)}</strong>. 
                                    Vui lòng thanh toán trước thời gian này.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Notes */}
                        {result.notes && (
                            <div className="text-sm text-muted-foreground">
                                <strong>Ghi chú:</strong> {result.notes}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
