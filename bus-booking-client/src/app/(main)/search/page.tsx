import type { Metadata } from "next";
import { Suspense } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowRight, AlertCircle } from "lucide-react";

import { searchTripsByProvince } from "@/queries";
// import { SearchResultsClient } from "./_components/search-results-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchResultsClient } from "./_components/search-results-client";

export const metadata: Metadata = {
    title: "Search Results - BusGo",
    description: "Find and book bus tickets for your journey",
};

interface SearchPageProps {
    searchParams: Promise<{
        from?: string;
        to?: string;
        date?: string;
        passengers?: string;
    }>;
}

function LoadingSkeleton() {
    return (
        <div className="flex gap-8">
            <aside className="w-72 shrink-0 hidden lg:block">
                <Skeleton className="h-80 w-full rounded-xl" />
            </aside>
            <div className="flex-1 space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full rounded-xl" />
                ))}
            </div>
        </div>
    );
}

async function SearchResults({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const { from, to, date, passengers } = params;

    // Validate required params
    if (!from || !to || !date) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Missing Search Parameters</AlertTitle>
                <AlertDescription>
                    Please provide departure province, arrival province, and date to search for trips.
                </AlertDescription>
            </Alert>
        );
    }

    const result = await searchTripsByProvince({
        departureProvince: from,
        arrivalProvince: to,
        departureDate: date,
        passengers: passengers ? parseInt(passengers) : undefined,
    });

    if (result.content.length === 0) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Trips Found</AlertTitle>
                <AlertDescription>
                    No trips available for this route on {format(new Date(date), "PPP", { locale: vi })}. 
                    Please try a different date or route.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <SearchResultsClient
            trips={result.content}
            passengers={passengers ? parseInt(passengers) : 1}
            totalElements={result.page.totalElements}
        />

    );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const { from, to, date, passengers } = params;

    // Format date for display
    const formattedDate = date ? format(new Date(date), "PPP", { locale: vi }) : "Not specified";

    return (
        <div className="container px-4 sm:px-6 lg:px-8 py-8">
            {/* Search Summary Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Search Results</h1>
                {from && to && (
                    <div className="flex flex-wrap items-center gap-2 text-lg text-muted-foreground">
                        <span className="font-medium text-foreground capitalize">{from.replace(/_/g, " ")}</span>
                        <ArrowRight className="size-5" />
                        <span className="font-medium text-foreground capitalize">{to.replace(/_/g, " ")}</span>
                        <span className="mx-2">•</span>
                        <span>{formattedDate}</span>
                        {passengers && (
                            <>
                                <span className="mx-2">•</span>
                                <span>{passengers} passenger(s)</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Results with Filters */}
            <Suspense fallback={<LoadingSkeleton />}>
                <SearchResults searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
