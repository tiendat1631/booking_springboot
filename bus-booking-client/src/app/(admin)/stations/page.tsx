import type { Metadata } from "next";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";

import { AdminHeader } from "../_components/admin-header";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getStations, getVNProvinces } from "@/data";
import { StationsTable } from "./_components/stations-table";
import { CreateStationDialog } from "./_components/create-station-dialog";
import { searchStationsParamsCache } from "./_lib/validations";

export const metadata: Metadata = {
    title: "Stations",
};

interface StationsPageProps {
    searchParams: Promise<SearchParams>;
}

async function StationsTableContent({ searchParams }: StationsPageProps) {
    const params = await searchParams;
    const search = searchStationsParamsCache.parse(params);

    const promises = Promise.all([
        getStations(search),
        getVNProvinces(),
    ]);
    return (
        <StationsTable
            promises={promises}
        />
    );
}

export default async function StationsPage({ searchParams }: StationsPageProps) {
    const params = await searchParams;
    const search = searchStationsParamsCache.parse(params);
    const provinces = await getVNProvinces();

    return (
        <>
            <AdminHeader title="Stations" />
            <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Header with action */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Stations</h2>
                        <p className="text-muted-foreground">
                            Manage bus stations and terminals
                        </p>
                    </div>
                    <CreateStationDialog provinces={provinces} />
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
                    <StationsTableContent searchParams={searchParams} />
                </Suspense>
            </div>
        </>
    );
}
