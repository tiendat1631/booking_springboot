"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getRouteColumns } from "./route-columns";
import { getRoutes } from "@/data";
import type { QueryKeys } from "@/types";

interface RoutesTableProps {
    promises: Promise<[
        Awaited<ReturnType<typeof getRoutes>>,
    ]>;
    queryKeys?: Partial<QueryKeys>;
}

export function RoutesTable({ promises, queryKeys }: RoutesTableProps) {
    const [{ content: data, page }] = React.use(promises);

    const columns = React.useMemo(() => getRouteColumns(), []);

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
