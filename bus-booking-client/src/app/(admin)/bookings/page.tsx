import { Suspense } from "react";
import { Container, PageHeader } from "@/components/ui/layout";
import { getAllBookings } from "@/queries";
import { BookingsTable, BookingsTableSkeleton } from "./_components/bookings-table";

interface BookingsPageProps {
    searchParams: Promise<{
        page?: string;
        perPage?: string;
        sort?: string;
        bookingStatus?: string;
        paymentStatus?: string;
        customerName?: string;
    }>;
}

export default async function AdminBookingsPage({ searchParams }: BookingsPageProps) {
    const params = await searchParams;

    return (
        <Container size="full">
            <PageHeader
                title="Quản lý đặt vé"
                description="Xem và quản lý tất cả các đơn đặt vé"
            />

            <Suspense key={JSON.stringify(params)} fallback={<BookingsTableSkeleton />}>
                <BookingsTableContent searchParams={params} />
            </Suspense>
        </Container>
    );
}

// Separate async component for streaming
async function BookingsTableContent({
    searchParams,
}: {
    searchParams: {
        page?: string;
        perPage?: string;
        sort?: string;
        bookingStatus?: string;
        paymentStatus?: string;
        customerName?: string;
    };
}) {
    const bookings = await getAllBookings({
        page: searchParams.page ? parseInt(searchParams.page) - 1 : 0, // Convert 1-indexed to 0-indexed
        size: searchParams.perPage ? parseInt(searchParams.perPage) : 10,
        status: searchParams.bookingStatus,
    });

    return <BookingsTable data={bookings} />;
}
