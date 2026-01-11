import type { Metadata } from "next";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";

import { AdminHeader } from "../_components/admin-header";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getBookings } from "@/queries";
import { BookingsTable } from "./_components/bookings-table";
import { searchBookingsParamsCache } from "@/lib/validations";

export const metadata: Metadata = {
    title: "Quản lý đặt vé",
};

interface BookingsPageProps {
    searchParams: Promise<SearchParams>;
}

async function BookingsTableContent({ searchParams }: BookingsPageProps) {
    const params = await searchParams;
    const search = searchBookingsParamsCache.parse(params);

    const promises = Promise.all([
        getBookings(search)
    ]);

    return <BookingsTable promises={promises} />;
}

export default async function AdminBookingsPage({ searchParams }: BookingsPageProps) {
    return (
        <>
            <AdminHeader title="Quản lý đặt vé" />
            <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Quản lý đặt vé</h2>
                        <p className="text-muted-foreground">
                            Xem và quản lý tất cả các đơn đặt vé
                        </p>
                    </div>
                </div>

                {/* Data Table */}
                <Suspense
                    fallback={
                        <DataTableSkeleton
                            columnCount={7}
                            rowCount={10}
                            filterCount={3}
                            withViewOptions
                            withPagination
                        />
                    }
                >
                    <BookingsTableContent searchParams={searchParams} />
                </Suspense>
            </div>
        </>
    );
}
