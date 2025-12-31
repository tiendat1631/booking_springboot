"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { useDataTable } from "@/hooks/use-data-table";
import { getBookingsColumns } from "./bookings-table-columns";
import type { Booking, PaginatedResponse } from "@/type";

interface BookingsTableProps {
    data: PaginatedResponse<Booking>;
}

export function BookingsTable({ data }: BookingsTableProps) {
    const columns = React.useMemo(() => getBookingsColumns(), []);

    const { table } = useDataTable({
        data: data.content,
        columns,
        pageCount: data.page.totalPages,
        initialState: {
            sorting: [{ id: "bookedAt", desc: true }],
            pagination: { pageIndex: 0, pageSize: data.page.size },
        },
        getRowId: (row) => row.id,
    });

    return (
        <DataTable table={table}>
            <DataTableToolbar table={table} />
        </DataTable>
    );
}

// Loading skeleton for SSR streaming
export function BookingsTableSkeleton() {
    return (
        <DataTableSkeleton
            columnCount={7}
            rowCount={10}
            filterCount={3}
            withViewOptions
            withPagination
        />
    );
}
