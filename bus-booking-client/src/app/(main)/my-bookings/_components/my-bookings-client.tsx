"use client";

import { useState } from "react";
import type { Booking } from "@/schemas/booking.schema";
import { BookingCard } from "./booking-card";
import { BookingDetailsDialog } from "./booking-details-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package } from "lucide-react";

interface MyBookingsClientProps {
    bookings: Booking[];
}

type BookingStatus = "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

const STATUS_LABELS: Record<BookingStatus, string> = {
    ALL: "Tất cả",
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    CANCELLED: "Đã hủy",
    COMPLETED: "Hoàn thành",
};

export function MyBookingsClient({ bookings }: MyBookingsClientProps) {
    const [selectedStatus, setSelectedStatus] = useState<BookingStatus>("ALL");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const filteredBookings = bookings.filter((booking) => {
        if (selectedStatus === "ALL") return true;
        return booking.status === selectedStatus;
    });

    const handleViewDetails = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Vé của tôi</h2>
                    <p className="text-muted-foreground">
                        Quản lý và theo dõi các vé đã đặt
                    </p>
                </div>
            </div>

            <Tabs
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as BookingStatus)}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
                    {Object.entries(STATUS_LABELS).map(([status, label]) => (
                        <TabsTrigger key={status} value={status}>
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Bookings Grid */}
            {filteredBookings.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredBookings.map((booking) => (
                        <BookingCard
                            key={booking.bookingId}
                            booking={booking}
                            onViewDetails={() => handleViewDetails(booking)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="rounded-full bg-muted p-6 mb-4">
                        <Package className="size-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                        Không có vé nào
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        {selectedStatus === "ALL"
                            ? "Bạn chưa đặt vé nào. Hãy tìm kiếm chuyến xe và đặt vé ngay!"
                            : `Không có vé nào ở trạng thái "${STATUS_LABELS[selectedStatus]}"`}
                    </p>
                    {selectedStatus === "ALL" && (
                        <Button asChild>
                            <a href="/search">Tìm chuyến xe</a>
                        </Button>
                    )}
                </div>
            )}

            {/* Booking Details Dialog */}
            <BookingDetailsDialog
                booking={selectedBooking}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    );
}
