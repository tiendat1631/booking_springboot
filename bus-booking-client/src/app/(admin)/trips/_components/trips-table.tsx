"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getTripColumns } from "./trip-columns";
import { getActiveRoutes, getTrips } from "@/queries";
import type { QueryKeys } from "@/type";

interface TripsTableProps {
    promises: Promise<[
        Awaited<ReturnType<typeof getTrips>>,
        Awaited<ReturnType<typeof getActiveRoutes>>,
    ]>;
    queryKeys?: Partial<QueryKeys>;
}

export function TripsTable({ promises, queryKeys }: TripsTableProps) {
    const [{ content: data, page }, routes] = React.use(promises);

    console.log(data);
    const columns = React.useMemo(
        () => getTripColumns(routes),
        [routes]
    );

    const { table } = useDataTable({
        data,
        columns,
        pageCount: page.totalPages,
        initialState: {
            pagination: { pageIndex: page.number, pageSize: page.size },
        },
        queryKeys,
        getRowId: (originalRow) => originalRow.id,
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
