import type { Metadata } from "next";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";

import { AdminHeader } from "../_components/admin-header";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getBuses } from "@/queries";
import { BusesTable } from "./_components/buses-table";
import { CreateBusDialog } from "./_components/create-bus-dialog";
import { searchBusesParamsCache } from "@/lib/validations";


export const metadata: Metadata = {
    title: "Quản lý xe khách",
};

interface BusesPageProps {
    searchParams: Promise<SearchParams>;
}

async function BusesTableContent({ searchParams }: BusesPageProps) {
    const params = await searchParams;
    const search = searchBusesParamsCache.parse(params);

    const promises = Promise.all([
        getBuses(search)
    ]);

    return <BusesTable promises={promises} />;
}

export default async function BusesPage({ searchParams }: BusesPageProps) {
    const params = await searchParams;
    const search = searchBusesParamsCache.parse(params);

    return (
        <>
            <AdminHeader title="Xe khách" />
            <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Header with action */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Xe khách</h2>
                        <p className="text-muted-foreground">
                            Quản lý đội xe và phương tiện
                        </p>
                    </div>
                    <CreateBusDialog />
                </div>

                {/* Data Table */}
                <Suspense
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
