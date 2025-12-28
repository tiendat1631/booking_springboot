"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getTripColumns } from "./trip-columns";
import { getTrips, getTripStatuses, getBusTypes } from "@/data";
import type { QueryKeys } from "@/types";

interface TripsTableProps {
    promises: Promise<[
        Awaited<ReturnType<typeof getTrips>>,
        Awaited<ReturnType<typeof getTripStatuses>>,
        Awaited<ReturnType<typeof getBusTypes>>,
    ]>;
    queryKeys?: Partial<QueryKeys>;
}

export function TripsTable({ promises, queryKeys }: TripsTableProps) {
    const [{ content: data, page }, statuses, busTypes] = React.use(promises);
    console.log(data);
    console.log(page);

    const columns = React.useMemo(
        () => getTripColumns({ statuses, busTypes }),
        [statuses, busTypes]
    );

    const { table } = useDataTable({
        data,
        columns,
        pageCount: page.totalPages,
        initialState: {
            pagination: { pageIndex: page.number, pageSize: page.size },
        },
        queryKeys,
        getRowId: (originalRow) => originalRow.tripId,
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
