"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getStationColumns } from "./station-columns";
import { getStations, getVNProvinces } from "@/data";
import type { QueryKeys } from "@/types";

interface StationsTableProps {
    promises: Promise<[
        Awaited<ReturnType<typeof getStations>>,
        Awaited<ReturnType<typeof getVNProvinces>>,
    ]>;
    queryKeys?: Partial<QueryKeys>;
}

export function StationsTable({ promises, queryKeys }: StationsTableProps) {
    const [{ content: data, page }, provinces] = React.use(promises);

    const columns = React.useMemo(
        () => getStationColumns(provinces),
        [provinces]
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
