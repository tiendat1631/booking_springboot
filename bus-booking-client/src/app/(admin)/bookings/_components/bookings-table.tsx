"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getBookingsColumns } from "./bookings-table-columns";
import { getBookings } from "@/queries";
import type { Booking } from "@/schemas/booking.schema";

interface BookingsTableProps {
    promises: Promise<[
        Awaited<ReturnType<typeof getBookings>>,
    ]>;
}

export function BookingsTable({ promises }: BookingsTableProps) {
    const [{ content: data, page }] = React.use(promises);

    const columns = React.useMemo(
        () => getBookingsColumns(),
        []
    );

    const { table } = useDataTable({
        data,
        columns,
        pageCount: page.totalPages,
        initialState: {
            sorting: [{ id: "bookingTime", desc: true }],
            pagination: { pageIndex: page.number, pageSize: page.size },
        },
        getRowId: (originalRow) => originalRow.bookingId,
        shallow: false,
        clearOnDefault: true,
        debounceMs: 500,
    });

    return (
        <DataTable table={table}>
            <DataTableToolbar table={table} />
        </DataTable>
    );
}
