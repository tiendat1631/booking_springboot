"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getBusColumns } from "./bus-columns";
import { getBuses, getBusTypes, getBusStatuses } from "@/data";
import type { QueryKeys } from "@/types";

interface BusesTableProps {
    promises: Promise<[
        Awaited<ReturnType<typeof getBuses>>,
        Awaited<ReturnType<typeof getBusTypes>>,
        Awaited<ReturnType<typeof getBusStatuses>>,
    ]>;
    queryKeys?: Partial<QueryKeys>;
}

export function BusesTable({ promises, queryKeys }: BusesTableProps) {
    const [{ content: data, page }, busTypes, busStatuses] = React.use(promises);

    const columns = React.useMemo(
        () => getBusColumns({ busTypes, busStatuses }),
        [busTypes, busStatuses]
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
