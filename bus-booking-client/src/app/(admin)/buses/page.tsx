import type { Metadata } from "next";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";

import { AdminHeader } from "../_components/admin-header";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getBuses, getBusTypes, getBusStatuses } from "@/data";
import { BusesTable } from "./_components/buses-table";
import { CreateBusDialog } from "./_components/create-bus-dialog";
import { searchBusesParamsCache } from "./_lib/validations";

export const metadata: Metadata = {
    title: "Buses",
};

interface BusesPageProps {
    searchParams: Promise<SearchParams>;
}

async function BusesTableContent({ searchParams }: BusesPageProps) {
    const params = await searchParams;
    const search = searchBusesParamsCache.parse(params);

    const promises = Promise.all([
        getBuses(search),
        getBusTypes(),
        getBusStatuses(),
    ]);

    return <BusesTable promises={promises} />;
}

export default async function BusesPage({ searchParams }: BusesPageProps) {
    const params = await searchParams;
    const search = searchBusesParamsCache.parse(params);

    return (
        <>
            <AdminHeader title="Buses" />
            <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Header with action */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Buses</h2>
                        <p className="text-muted-foreground">
                            Manage bus fleet and vehicles
                        </p>
                    </div>
                    <CreateBusDialog />
                </div>

                {/* Data Table */}
                <Suspense
                    key={JSON.stringify(search)}
                    fallback={
                        <DataTableSkeleton
                            columnCount={6}
                            rowCount={10}
                            withPagination
                        />
                    }
                >
                    <BusesTableContent searchParams={searchParams} />
                </Suspense>
            </div>
        </>
    );
}
