import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import type { SearchParams } from "nuqs/server";

import { AdminHeader } from "../_components/admin-header";
import { Button } from "@/components/ui/button";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getTrips, getTripStatuses, getBusTypes } from "@/data";
import { TripsTable } from "./_components/trips-table";
import { searchTripsParamsCache } from "./_lib/validations";

export const metadata: Metadata = {
    title: "Trips",
};

interface TripsPageProps {
    searchParams: Promise<SearchParams>;
}

async function TripsTableContent({ searchParams }: TripsPageProps) {
    const params = await searchParams;
    const search = searchTripsParamsCache.parse(params);

    const promises = Promise.all([
        getTrips(search),
        getTripStatuses(),
        getBusTypes(),
    ]);

    return <TripsTable promises={promises} />;
}

export default async function TripsPage({ searchParams }: TripsPageProps) {
    const params = await searchParams;
    const search = searchTripsParamsCache.parse(params);

    return (
        <>
            <AdminHeader title="Trips" />
            <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Header with action */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Trips</h2>
                        <p className="text-muted-foreground">
                            Manage scheduled trips and availability
                        </p>
                    </div>
                    <Button>
                        <Plus />
                        Add Trip
                    </Button>
                </div>

                {/* Data Table */}
                <Suspense
                    key={JSON.stringify(search)}
                    fallback={
                        <DataTableSkeleton
                            columnCount={8}
                            rowCount={10}
                            withPagination
                        />
                    }
                >
                    <TripsTableContent searchParams={searchParams} />
                </Suspense>
            </div>
        </>
    );
}
