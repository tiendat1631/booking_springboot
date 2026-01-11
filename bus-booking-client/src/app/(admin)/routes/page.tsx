import type { Metadata } from "next";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";

import { AdminHeader } from "../_components/admin-header";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getRoutes, getVNProvinces } from "@/queries";
import { RoutesTable } from "./_components/routes-table";
import { CreateRouteDialog } from "./_components/create-route-dialog";
import { searchRoutesParamsCache } from "@/lib/validations";

export const metadata: Metadata = {
    title: "Quản lý tuyến đường",
};

interface RoutesPageProps {
    searchParams: Promise<SearchParams>;
}

async function RoutesTableContent({ searchParams }: RoutesPageProps) {
    const params = await searchParams;
    const search = searchRoutesParamsCache.parse(params);

    const promises = Promise.all([
        getRoutes(search),
    ]);
    return (
        <RoutesTable
            promises={promises}
        />
    );
}

export default async function RoutesPage({ searchParams }: RoutesPageProps) {
    const params = await searchParams;
    const search = searchRoutesParamsCache.parse(params);

    const promises = Promise.all([
        getVNProvinces(),
    ]);

    return (
        <>
            <AdminHeader title="Tuyến đường" />
            <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Header with action */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Tuyến đường</h2>
                        <p className="text-muted-foreground">
                            Quản lý tuyến xe và giá vé
                        </p>
                    </div>
                    <CreateRouteDialog promises={promises} />
                </div>

                {/* Data Table */}
                <Suspense
                    fallback={
                        <DataTableSkeleton
                            columnCount={8}
                            rowCount={10}
                            withPagination
                        />
                    }
                >
                    <RoutesTableContent searchParams={searchParams} />
                </Suspense>
            </div>
        </>
    );
}
